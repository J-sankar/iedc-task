import express from "express";
import cors from "cors";
import projectRouter from "./routes/projects.routes.js" ;
import authRouter from "./routes/auth.routes.js"
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/projects", projectRouter) ;
app.use("/api/auth", authRouter)
app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use(errorHandler)

export default app;