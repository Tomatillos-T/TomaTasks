resource "oci_artifacts_container_repository" todolist {
  #Required
  compartment_id = var.ociCompartmentOcid
  display_name = "${var.runName}/${var.mtdrKey}/TomaTask-springboot"
  is_public = true
}