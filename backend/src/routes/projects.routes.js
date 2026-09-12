import { Router } from "express"; 
import { listProjects,createProject,getProject } from "../controller/projects.controller.js";
import { validateCreateProject } from "../validators/projects.validators.js";
const router = Router()

router.get("/", listProjects)
router.post("/", validateCreateProject,createProject )
router.get("/:id", getProject)

export default router