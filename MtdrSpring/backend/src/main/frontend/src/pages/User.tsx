// User.tsx
import { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
import { HttpClient } from "../services/httpClient";
import type { User as UserType } from "../services/authService";

interface SubmitStatus {
  type: "success" | "error" | null;
  message: string;
}

export default function User() {
  const { user, setUser, isAuthenticated } = useUserContext();
  const [formData, setFormData] = useState<UserType | null>(user || null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: null, message: "" });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-default">
        <p className="text-lg text-text-secondary">Please log in to view your profile.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!formData) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const updatedUser = await HttpClient.put<UserType>(`/api/user/${formData.id}`, formData, { auth: true });
      setUser(updatedUser);
      setFormData(updatedUser);
      setSubmitStatus({ type: "success", message: "Profile updated successfully." });
      setIsEditing(false);
    } catch (error: any) {
      setSubmitStatus({ type: "error", message: error.message || "Failed to update profile." });
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

  return (
    <section className="min-h-screen flex items-center justify-center bg-background-default">
      <div className="max-w-2xl w-full p-8 bg-background-paper rounded-2xl shadow-lg space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">User Profile</h2>
            <p className="text-sm text-text-secondary">Manage your account details below.</p>
          </div>
          <Button
            type="button"
            variant={isEditing ? "secondary" : "primary"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>

        {submitStatus.type && <Alert type={submitStatus.type} message={submitStatus.message} />}

        <div className="grid grid-cols-1 gap-6">
          <Input label="User ID" name="id" value={formData?.id || ""} disabled />
          <Input label="Username" name="username" value={formData?.username || ""} disabled />
          <Input label="Role" name="role" value={formData?.role?.role || ""} disabled />
          <Input label="First Name" name="firstName" value={formData?.firstName || ""} onChange={handleChange} disabled={!isEditing} />
          <Input label="Last Name" name="lastName" value={formData?.lastName || ""} onChange={handleChange} disabled={!isEditing} />
          <Input label="Email" type="email" name="email" value={formData?.email || ""} onChange={handleChange} disabled={!isEditing} />
          <Input label="Phone Number" name="phoneNumber" value={formData?.phoneNumber || ""} onChange={handleChange} disabled={!isEditing} />
          <Input label="Enabled" name="enabled" value={formData?.enabled ? "Yes" : "No"} disabled />
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
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteAccount} loading={isSubmitting}>Delete</Button>
          </>
        }
      >
        <p className="text-text-secondary">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>
      </Modal>
    </section>
  );
}
