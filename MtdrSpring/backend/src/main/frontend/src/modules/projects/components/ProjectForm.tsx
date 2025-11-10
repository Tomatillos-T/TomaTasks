// projects/components/ProjectForm.tsx
import ProjectFormFields from "./ProjectFormFields";
import TeamFormModal from "./TeamFormModal";
import { useProjectForm } from "../hooks/useProjectForm";
import { useTeamForm } from "../hooks/useTeamForm";
import type { Team } from "../services/teamService";
import { useCallback } from "react";

// interface avec la prop de callback
interface ProjectFormProps {
  onProjectCreated?: () => void;
}

export default function ProjectForm({ onProjectCreated }: ProjectFormProps) {
  const {
    formData,
    handleChange,
    resetForm,
    isSubmitting,
    submitStatus,
    teams,
    isLoadingTeams,
    tempProjectId,
    isCreatingProjectForTeam,
    createTemporaryProjectIfNeeded,
    handleSubmit,
    fetchTeams,
    setFormData,
    setSubmitStatus,
  } = useProjectForm();

  // 🔹 Gestion création d’équipe
  const onTeamCreated = useCallback(
    (team: Team) => {
      setFormData((prev) => ({ ...prev, teamId: team.id }));
      fetchTeams();
      setSubmitStatus({
        type: "success",
        message: `Equipo "${team.name}" creado y asociado al proyecto.`,
      });
    },
    [fetchTeams, setFormData, setSubmitStatus]
  );

  const {
    teamFormData,
    handleTeamChange,
    isSubmittingTeam,
    teamSubmitStatus,
    isTeamModalOpen,
    openTeamModal,
    closeTeamModal,
    handleCreateTeam,
    setTeamFormData,
  } = useTeamForm(onTeamCreated);

  // 🔹 Ouverture du modal équipe
  const handleCreateTeamClick = async () => {
    if (tempProjectId) {
      openTeamModal(tempProjectId);
      setTeamFormData((prev) => ({ ...prev, projectId: tempProjectId }));
      return;
    }

    const createdId = await createTemporaryProjectIfNeeded();
    if (createdId) {
      openTeamModal(createdId);
      setTeamFormData((prev) => ({ ...prev, projectId: createdId }));
    }
  };

  // ✅ Nouvelle fonction de soumission qui appelle la callback parent
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleSubmit(e);

    // Si la création a réussi, notifie le parent
    if (result) {
      onProjectCreated?.();
      resetForm(); 
    }
  };

  return (
    <>
      <form
        onSubmit={handleFormSubmit}
        className="max-w-3xl w-full space-y-8 p-8 bg-background-paper rounded-2xl shadow-lg"
      >
        <ProjectFormFields
          formData={formData}
          onChange={handleChange}
          teams={teams}
          isLoadingTeams={isLoadingTeams}
          isSubmitting={isSubmitting}
          tempProjectId={tempProjectId}
          isCreatingProjectForTeam={isCreatingProjectForTeam}
          submitStatus={submitStatus}
          onCreateTeamClick={handleCreateTeamClick}
          resetForm={resetForm}
        />
      </form>

      <TeamFormModal
        isOpen={isTeamModalOpen}
        onClose={closeTeamModal}
        teamFormData={teamFormData}
        onChange={handleTeamChange}
        onSubmit={handleCreateTeam}
        isSubmittingTeam={isSubmittingTeam}
        teamSubmitStatus={teamSubmitStatus}
      />
    </>
  );
}
