// teams/components/TeamForm.tsx
import Button from "../../../components/Button"
import Alert from "../../../components/Alert"
import { useTeamForm } from "../hooks/useTeamForm"
import { useProjectModalForm } from "../hooks/useProjectModalForm"
import ProjectFormModal from "./ProjectFormModal"
import TeamFormFields from "./TeamFormFields"

export default function TeamForm() {
  const teamForm = useTeamForm()
  const projectModal = useProjectModalForm((projectId) => {
    teamForm.teamFormData.projectId = projectId
  })

  return (
    <section className="min-h-screen flex items-center justify-center bg-background-default">
      <form onSubmit={teamForm.handleSubmit} className="max-w-3xl w-full p-8 bg-background-paper rounded-2xl shadow-lg space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Información del equipo</h2>
          <p className="text-sm text-text-secondary">Completa los detalles del equipo.</p>
        </div>

        {teamForm.submitStatus.type && <Alert type={teamForm.submitStatus.type} message={teamForm.submitStatus.message} />}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TeamFormFields
            formData={teamForm.teamFormData}
            projects={projectModal.projects}
            onChange={teamForm.handleTeamChange}
            onOpenProjectModal={() => projectModal.setIsProjectModalOpen(true)}
            isSubmitting={teamForm.isSubmitting}
          />
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button type="button" variant="secondary" onClick={teamForm.resetForm} disabled={teamForm.isSubmitting}>Reiniciar</Button>
          <Button type="submit" variant="primary" loading={teamForm.isSubmitting} disabled={teamForm.isSubmitting}>Guardar equipo</Button>
        </div>
      </form>

      <ProjectFormModal
        isOpen={projectModal.isProjectModalOpen}
        onClose={() => projectModal.setIsProjectModalOpen(false)}
        projectFormData={projectModal.projectFormData}
        onChange={projectModal.handleProjectChange}
        onSubmit={projectModal.handleCreateProject}
        isSubmittingProject={projectModal.isSubmittingProject}
        projectSubmitStatus={projectModal.projectSubmitStatus}
      />
    </section>
  )
}
