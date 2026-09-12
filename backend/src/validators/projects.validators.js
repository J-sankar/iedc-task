import { ApiError } from "../middlewares/errorHandler.js";

const VALID_STATUSES = ["IDEATION", "PROTOTYPE", "SEED_FUNDED"];

export function validateCreateProject(req, res, next) {
  const { title, domain, abstract, status } = req.body;
  const missing = [];

  if (!title || typeof title !== "string" || !title.trim()) missing.push("title");
  if (!domain || typeof domain !== "string" || !domain.trim()) missing.push("domain");
  if (!abstract || typeof abstract !== "string" || !abstract.trim()) missing.push("abstract");

  if (missing.length > 0) {
    return next(new ApiError(400, `Missing or invalid required field(s): ${missing.join(", ")}`));
  }
  
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return next(new ApiError(400, `status must be one of: ${VALID_STATUSES.join(", ")}`));
  }

  next();
}

export function validateUpdateProjectStatus(req, res, next) {
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return next(new ApiError(400, `status must be one of: ${VALID_STATUSES.join(", ")}`));
  }

  next();
}