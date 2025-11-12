// projects/components/ProjectForm.tsx
import { useEffect, useCallback } from "react";
import ProjectFormFields from "./ProjectFormFields";
import TeamFormModal from "./TeamFormModal";
import { useProjectForm } from "../hooks/useProjectForm";
import { useTeamForm } from "../hooks/useTeamForm";
import type { Team } from "../services/teamService";
import type { Project } from "../services/projectService";

interface ProjectFormProps {
  onProjectCreated?: () => void;
  initialData?: Project;
  isEditing?: boolean;
  onSubmit?: (data: Project) => void;
}

export default function ProjectForm({ onProjectCreated, initialData, isEditing, onSubmit }: ProjectFormProps) {
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
  } = useProjectForm({ initialData });

  
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        status: initialData.status || "planning",
        startDate: initialData.startDate || "",
        deliveryDate: initialData.deliveryDate || "",
        endDate: initialData.endDate || "",
        teamId: initialData.team?.id || "",
      });
    }
  }, [initialData, setFormData]);

  
  const onTeamCreated = useCallback(
    (team: Team) => {
      setFormData(prev => ({ ...prev, teamId: team.id }));
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

  
  const handleCreateTeamClick = async () => {
    let projectId = tempProjectId;
    if (!projectId) {
      projectId = await createTemporaryProjectIfNeeded();
    }
    if (projectId) {
      openTeamModal(projectId);
      setTeamFormData(prev => ({ ...prev, projectId }));
    }
  };

  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleSubmit(); 

    if (result) {
      if (isEditing && onSubmit) {
        await onSubmit(result);
      } else {
        onProjectCreated?.();
      }
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
