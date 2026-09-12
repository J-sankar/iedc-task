import { Router } from "express"; 
import { requireAuth } from "../middlewares/auth.js";
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
router.get("/:id", getProject)
router.post("/", requireAuth,validateCreateProject,createProject )
router.put("/:id", requireAuth,validateUpdateProjectStatus, updateProjectStatus)
router.delete("/:id", requireAuth,deleteProject)

export default router