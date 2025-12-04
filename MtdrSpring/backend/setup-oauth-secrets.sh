#!/bin/bash
# Setup OAuth Secrets for Kubernetes Deployment
# This script creates the necessary Kubernetes secrets for TomaTasks OAuth integration

set -e

echo "=========================================="
echo "TomaTasks OAuth Secrets Setup"
echo "=========================================="
echo ""

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed or not in PATH"
    exit 1
fi

# Set namespace
NAMESPACE="mtdrworkshop"

echo "Using namespace: $NAMESPACE"
echo ""

# Load environment variables from .env file
if [ -f .env ]; then
    echo "Loading credentials from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Warning: .env file not found. You'll need to provide credentials manually."
fi

# Function to create or update secret
create_or_update_secret() {
    local secret_name=$1
    shift
    local literals=("$@")

    # Check if secret exists
    if kubectl get secret "$secret_name" -n "$NAMESPACE" &> /dev/null; then
        echo "Secret '$secret_name' already exists. Deleting..."
        kubectl delete secret "$secret_name" -n "$NAMESPACE"
    fi

    echo "Creating secret: $secret_name"
    kubectl create secret generic "$secret_name" "${literals[@]}" -n "$NAMESPACE"
}

# Create GitHub OAuth secret
echo ""
echo "1. Creating GitHub OAuth secret..."
if [ -z "$GITHUB_CLIENT_ID" ] || [ -z "$GITHUB_CLIENT_SECRET" ]; then
    echo "Error: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET not set in .env"
    exit 1
fi
create_or_update_secret "github-oauth-secret" \
    --from-literal=client_id="$GITHUB_CLIENT_ID" \
    --from-literal=client_secret="$GITHUB_CLIENT_SECRET"

# Create Google API secret
echo ""
echo "2. Creating Google API secret..."
if [ -z "$GOOGLE_API_KEY" ]; then
    echo "Error: GOOGLE_API_KEY not set in .env"
    exit 1
fi
create_or_update_secret "google-api-secret" \
    --from-literal=api_key="$GOOGLE_API_KEY"

# Create OAuth encryption secret
echo ""
echo "3. Creating OAuth encryption secret..."
if [ -z "$OAUTH_ENCRYPTION_KEY" ]; then
    echo "Error: OAUTH_ENCRYPTION_KEY not set in .env"
    exit 1
fi
create_or_update_secret "oauth-encryption-secret" \
    --from-literal=encryption_key="$OAUTH_ENCRYPTION_KEY"

echo ""
echo "=========================================="
echo "✓ All secrets created successfully!"
echo "=========================================="
echo ""
echo "Verify secrets with:"
echo "  kubectl get secrets -n $NAMESPACE | grep -E 'github-oauth|google-api|oauth-encryption'"
echo ""
echo "Next steps:"
echo "  1. Add both callback URLs to your GitHub OAuth app:"
echo "     - http://localhost:8080/api/oauth/callback/github (local)"
echo "     - http://163.192.133.86/api/oauth/callback/github (production)"
echo "  2. Run ./deploy.sh to deploy the application"
echo ""
