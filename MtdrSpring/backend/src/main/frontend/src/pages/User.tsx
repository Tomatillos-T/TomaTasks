// User.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import Modal from "@/components/Modal";
import { HttpClient } from "@/services/httpClient";
import type { User as UserType } from "@/services/authService";

interface SubmitStatus {
  type: "success" | "error" | null;
  message: string;
}

export default function User() {
  const navigate = useNavigate();
  const { user, setUser, isAuthenticated } = useUserContext();
  const { logout } = useAuth();
  const [formData, setFormData] = useState<UserType | null>(user || null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: null,
    message: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [telegramOtp, setTelegramOtp] = useState<string | null>(null);
  const [otpExpiresAt, setOtpExpiresAt] = useState<Date | null>(null);
  const [otpCountdown, setOtpCountdown] = useState<string | null>(null);
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  // Fetch existing OTP on page load
  useEffect(() => {
    const fetchExistingOtp = async () => {
      if (!formData?.email) return;

      try {
        const response = await HttpClient.get<{ hasOtp: boolean; otp?: string; expiresAt?: number }>(
          `/api/bot/otp/current?email=${encodeURIComponent(formData.email)}`,
          { auth: true }
        );

        if (response.hasOtp && response.otp && response.expiresAt) {
          const expiresDate = new Date(response.expiresAt);
          // Only set if not expired
          if (expiresDate > new Date()) {
            setTelegramOtp(response.otp);
            setOtpExpiresAt(expiresDate);
          }
        }
      } catch (error) {
        // Silently fail - user can generate a new OTP if needed
        console.log("No existing OTP found or error fetching:", error);
      }
    };

    fetchExistingOtp();
  }, [formData?.email]);

  // Countdown timer for OTP expiration
  useEffect(() => {
    if (!otpExpiresAt || !telegramOtp) {
      setOtpCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = otpExpiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        // OTP expired
        setTelegramOtp(null);
        setOtpExpiresAt(null);
        setOtpCountdown(null);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setOtpCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [otpExpiresAt, telegramOtp]);

  useEffect(() => {
    // Check for GitHub OAuth callback status
    const params = new URLSearchParams(window.location.search);
    const githubStatus = params.get("github");

    if (githubStatus === "success") {
      setSubmitStatus({
        type: "success",
        message: "GitHub account connected successfully!",
      });
      // Refresh user data
      if (formData?.id) {
        HttpClient.get<UserType>(`/api/user/${formData.id}`, { auth: true })
          .then(updatedUser => {
            setUser(updatedUser);
            setFormData(updatedUser);
          });
      }
      // Clean URL
      window.history.replaceState({}, "", "/user");
    } else if (githubStatus === "error") {
      setSubmitStatus({
        type: "error",
        message: "Failed to connect GitHub account. Please try again.",
      });
      // Clean URL
      window.history.replaceState({}, "", "/user");
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-default">
        <p className="text-lg text-text-secondary">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!formData) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const updatedUser = await HttpClient.put<UserType>(
        `/api/user/${formData.id}`,
        formData,
        { auth: true }
      );
      setUser(updatedUser);
      setFormData(updatedUser);
      setSubmitStatus({
        type: "success",
        message: "Profile updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to update profile.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!formData) return;
    setIsSubmitting(true);

    try {
      await HttpClient.delete(`/api/user/${formData.id}`, { auth: true });
      setUser(null);
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateTelegramOtp = async () => {
    if (!formData?.email) return;
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await HttpClient.post<{ otp: string; message: string; expiresInMinutes: number }>(
        `/api/bot/otp/generate?email=${encodeURIComponent(formData.email)}`,
        {},
        { auth: true }
      );
      setTelegramOtp(response.otp);
      setOtpExpiresAt(new Date(Date.now() + response.expiresInMinutes * 60 * 1000));
      setSubmitStatus({
        type: "success",
        message: "Código OTP generado. Ingresa este código en el bot de Telegram para iniciar sesión.",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Error al generar el código OTP.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectGithub = async () => {
    if (!formData) return;
    setIsConnectingGithub(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Get GitHub authorization URL
      const response = await HttpClient.get<{ url: string }>(
        `/api/auth/github/authorize/${formData.id}`,
        { auth: true }
      );

      // Open OAuth popup window
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      window.open(
        response.url,
        "GitHub OAuth",
        `width=${width},height=${height},left=${left},top=${top}`
      );
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to initiate GitHub connection.",
      });
      setIsConnectingGithub(false);
    }
  };

  const handleDisconnectGithub = async () => {
    if (!formData) return;
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await HttpClient.delete<{ user: UserType }>(
        `/api/auth/github/${formData.id}/unlink`,
        { auth: true }
      );

      setFormData(response.user);
      setUser(response.user);
      setSubmitStatus({
        type: "success",
        message: "GitHub account disconnected successfully.",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to disconnect GitHub account.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background-default py-8">
      <div className="w-full max-w-4xl mx-4 p-6 bg-background-paper rounded-2xl shadow-lg space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">
              User Profile
            </h2>
            <p className="text-sm text-text-secondary">
              Manage your account details below.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button
              type="button"
              variant={isEditing ? "secondary" : "primary"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </div>

            {submitStatus.type && (
              <Alert type={submitStatus.type} message={submitStatus.message} />
            )}

        <div className="grid grid-cols-1 gap-6">
          <Input
            label="User ID"
            name="id"
            value={formData?.id || ""}
            disabled
          />
          <Input
            label="Username"
            name="username"
            value={formData?.username || ""}
            disabled
          />
          <Input
            label="Role"
            name="role"
            value={formData?.role || ""}
            disabled
          />
          <Input
            label="First Name"
            name="firstName"
            value={formData?.firstName || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData?.lastName || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData?.email || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <Input
            label="Phone Number"
            name="phoneNumber"
            value={formData?.phoneNumber || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <Input
            label="Enabled"
            name="enabled"
            value={formData?.enabled ? "Yes" : "No"}
            disabled
          />
        </div>

            <div className="space-y-2 border-t pt-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Telegram Bot Login
              </h3>
              <p className="text-sm text-text-secondary mb-2">
                Para iniciar sesión en el bot de Telegram, genera un código OTP y
                ingrésalo cuando el bot te lo solicite.
              </p>
              {telegramOtp && (
                <div className="bg-background-default p-4 rounded-lg border border-primary-light">
                  <p className="text-sm text-text-secondary mb-1">Tu código OTP:</p>
                  <p className="text-3xl font-mono font-bold text-primary-main tracking-widest text-center">
                    {telegramOtp}
                  </p>
                  {otpCountdown && (
                    <p className="text-xs text-text-secondary mt-2 text-center">
                      Expira en <span className="font-mono font-semibold text-primary-main">{otpCountdown}</span>
                    </p>
                  )}
                </div>
              )}
              <Button
                type="button"
                variant="primary"
                onClick={handleGenerateTelegramOtp}
                disabled={isSubmitting}
              >
                {telegramOtp ? "Generar nuevo código OTP" : "Generar código OTP para Telegram"}
              </Button>
              {telegramOtp && (
                <p className="text-sm text-text-secondary">
                  Ingresa tu email en el bot de Telegram y luego este código cuando te lo solicite.
                </p>
              )}
            </div>

        <div className="space-y-2 border-t pt-4">
          <h3 className="text-lg font-semibold text-text-primary">
            GitHub Integration
          </h3>
          {formData?.githubUsername ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
                <Input
                  label="Connected GitHub Account"
                  name="githubUsername"
                  value={`@${formData.githubUsername}`}
                  disabled
                />
              </div>
              <Button
                type="button"
                variant="danger"
                onClick={handleDisconnectGithub}
                disabled={isSubmitting}
              >
                Disconnect GitHub
              </Button>
              <p className="text-sm text-text-secondary">
                Your GitHub account is connected and can be used for private repository access.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-text-secondary">
                Connect your GitHub account to enable private repository analysis with RAG.
              </p>
              <Button
                type="button"
                variant="primary"
                onClick={handleConnectGithub}
                disabled={isConnectingGithub || isSubmitting}
              >
                Connect GitHub Account
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button
            type="button"
            variant="danger"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isSubmitting}
          >
            Delete Account
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Deletion"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              loading={isSubmitting}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-text-secondary">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
      </Modal>
    </section>
  );
}
