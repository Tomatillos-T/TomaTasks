#!/bin/bash
SCRIPT_DIR=$(pwd)

#Validation
if [ -z "$DOCKER_REGISTRY" ]; then
    export DOCKER_REGISTRY=$(state_get DOCKER_REGISTRY)
    echo "DOCKER_REGISTRY set."
fi
if [ -z "$DOCKER_REGISTRY" ]; then
    echo "Error: DOCKER_REGISTRY env variable needs to be set!"
    exit 1
fi

if [ -z "$TODO_PDB_NAME" ]; then
    export TODO_PDB_NAME=$(state_get MTDR_DB_NAME)
    echo "TODO_PDB_NAME set."
fi
if [ -z "$TODO_PDB_NAME" ]; then
    echo "Error: TODO_PDB_NAME env variable needs to be set!"
    exit 1
fi

if [ -z "$OCI_REGION" ]; then
    echo "OCI_REGION not set. Will get it with state_get"
    export OCI_REGION=$(state_get REGION)
fi
if [ -z "$OCI_REGION" ]; then
    echo "Error: OCI_REGION env variable needs to be set!"
    exit 1
fi

if [ -z "$UI_USERNAME" ]; then
    echo "UI_USERNAME not set. Will get it with state_get"
    export UI_USERNAME=$(state_get UI_USERNAME)
fi
if [ -z "$UI_USERNAME" ]; then
    echo "Error: UI_USERNAME env variable needs to be set!"
    exit 1
fi

echo "Creating springboot deplyoment and service"
export CURRENTTIME=$( date '+%F_%H:%M:%S' )
echo CURRENTTIME is $CURRENTTIME  ...this will be appended to generated deployment yaml
cp src/main/resources/TomaTask-springboot.yaml TomaTask-springboot-$CURRENTTIME.yaml

sed -i "s|%DOCKER_REGISTRY%|${DOCKER_REGISTRY}|g" TomaTask-springboot-$CURRENTTIME.yaml

sed -e "s|%DOCKER_REGISTRY%|${DOCKER_REGISTRY}|g" TomaTask-springboot-${CURRENTTIME}.yaml > /tmp/TomaTask-springboot-${CURRENTTIME}.yaml
mv -- /tmp/TomaTask-springboot-$CURRENTTIME.yaml TomaTask-springboot-$CURRENTTIME.yaml
sed -e "s|%TODO_PDB_NAME%|${TODO_PDB_NAME}|g" TomaTask-springboot-${CURRENTTIME}.yaml > /tmp/TomaTask-springboot-${CURRENTTIME}.yaml
mv -- /tmp/TomaTask-springboot-$CURRENTTIME.yaml TomaTask-springboot-$CURRENTTIME.yaml
sed -e "s|%OCI_REGION%|${OCI_REGION}|g" TomaTask-springboot-${CURRENTTIME}.yaml > /tmp/TomaTask-springboot-$CURRENTTIME.yaml
mv -- /tmp/TomaTask-springboot-$CURRENTTIME.yaml TomaTask-springboot-$CURRENTTIME.yaml
sed -e "s|%UI_USERNAME%|${UI_USERNAME}|g" TomaTask-springboot-${CURRENTTIME}.yaml > /tmp/TomaTask-springboot-$CURRENTTIME.yaml
mv -- /tmp/TomaTask-springboot-$CURRENTTIME.yaml TomaTask-springboot-$CURRENTTIME.yaml
if [ -z "$1" ]; then
    kubectl apply -f $SCRIPT_DIR/TomaTask-springboot-$CURRENTTIME.yaml -n mtdrworkshop
else
    kubectl apply -f <(istioctl kube-inject -f $SCRIPT_DIR/TomaTask-springboot-$CURRENTTIME.yaml) -n mtdrworkshop
fi
