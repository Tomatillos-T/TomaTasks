// projects/components/ProjectForm.tsx
import ProjectFormFields from "./ProjectFormFields"
import TeamFormModal from "./TeamFormModal"
import { useProjectForm } from "../hooks/useProjectForm"
import { useTeamForm } from "../hooks/useTeamForm"
import type { Team } from "../services/teamService"

export default function ProjectForm() {
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
  } = useProjectForm()

  // Cuando se crea un equipo, actualizamos el teamId en formData y recargamos equipos
  const onTeamCreated = (team: Team) => {
    setFormData(prev => ({ ...prev, teamId: team.id }))
    fetchTeams()
    // También dejamos un mensaje en el formulario principal (similar al original)
    setSubmitStatus({ type: "success", message: `Equipo "${team.name}" creado y asociado al proyecto.` })
  }

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
  } = useTeamForm(onTeamCreated)

  // Abrir modal para crear equipo, creando proyecto temporal si es necesario
  const handleCreateTeamClick = async () => {
    // Si ya hay proyecto temporal, abrimos directamente el modal
    if (tempProjectId) {
      openTeamModal(tempProjectId)
      // Prellenar projectId en el formulario de equipo
      setTeamFormData(prev => ({ ...prev, projectId: tempProjectId }))
      return
    }

    const createdId = await createTemporaryProjectIfNeeded()
    if (createdId) {
      openTeamModal(createdId)
      setTeamFormData(prev => ({ ...prev, projectId: createdId }))
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-3xl w-full space-y-8 p-8 bg-background-paper rounded-2xl shadow-lg">
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
        onClose={() => {
          closeTeamModal()
        }}
        teamFormData={teamFormData}
        onChange={handleTeamChange}
        onSubmit={handleCreateTeam}
        isSubmittingTeam={isSubmittingTeam}
        teamSubmitStatus={teamSubmitStatus}
      />
    </>
  )
}
