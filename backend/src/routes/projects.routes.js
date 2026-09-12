import { Router } from "express"; 
import {
	listProjects,
	createProject,
	getProject,
	updateProjectStatus,
	deleteProject,
} from "../controller/projects.controller.js";
import {
	validateCreateProject,
	validateUpdateProjectStatus,
} from "../validators/projects.validators.js";
const router = Router()

router.get("/", listProjects)
router.post("/", validateCreateProject,createProject )
router.get("/:id", getProject)
router.put("/:id", validateUpdateProjectStatus, updateProjectStatus)
router.delete("/:id", deleteProject)

export default router