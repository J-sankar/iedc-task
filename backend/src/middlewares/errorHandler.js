 export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(err, req, res, next) {
  console.error(`ERROR:${err.message}`);

  // Prisma: record not found (e.g. update/delete on a nonexistent id)
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Resource not found" });
  }

  // Prisma: unique constraint violation
  if (err.code === "P2002") {
    return res.status(409).json({
      error: "A record with this value already exists",
      fields: err.meta?.target,
    });
  }

  // Prisma: foreign key constraint failed (e.g. teamLeadId doesn't exist)
  if (err.code === "P2003") {
    return res.status(400).json({
      error: "Referenced record does not exist",
      field: err.meta?.field_name,
    });
  }

  // Our own thrown errors (validation, 404s we raise manually, etc.)
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Fallback: anything unexpected
  res.status(500).json({ error: "Internal server error" });
}