import jwt from "jsonwebtoken";
import { ApiError } from "./errorHandler.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing or invalid Authorization header"));
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; 
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token"));
  }
}