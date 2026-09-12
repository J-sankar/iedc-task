import prisma from "../../prisma/db.js"
import { ApiError } from "../middlewares/errorHandler.js";
export const listProjects = async (req, res, next) => {
    try {
        const { status, domain } = req.query
        if (status) where.status = status;
        if (domain) where.domain = { equals: domain, mode: "insensitive" };

        const projects = await prisma.project.findMany({
            where,
            include: {
                teamLead: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        console.log(`Obtained ${projects.length} projects`)

        res.json({ count: projects.length, projects });
    } catch (error) {
        next(err);
    }
}


export const createProject = async (req, res, next) => {
    try {
        const { title, domain, teamLeadId, abstract, status } = req.body;
        const where = {}
        where.title = title;
        where.domain = domain;
        where.teamLeadId = teamLeadId;
        where.abstract = abstract;

        const existingProject = await prisma.project.findFirst({
            where
        });
        if (existingProject) {
            throw new ApiError(409, "Same project config already exists");
        }
        const project = await prisma.project.create({
            data: {
                title: title.trim(),
                domain: domain.trim(),
                abstract: abstract.trim(),
                teamLeadId,
                ...(status && { status }),
            },
            include: {
                teamLead: { select: { id: true, name: true, email: true } },
            },
        });
        console.log(`New project created: id ${project.id}`)

        res.status(201).json(project);
    } catch (err) {

        next(err);
    }
}


export const getProject = async (req, res, next) => {
    const id = req.params.id
    try{

        const project = await prisma.project.findFirst({
            where: { id },
            include: {
                teamLead: { select: { id: true, name: true, email: true } },
            },
        })
        if (!project) {
            throw new ApiError(404, "Project not found")
        }
        console.log(`Obtained project details : id   ${id}`)
        return res.status(200).json({success:true, data: project})
    }catch (err) {
        next(err)
    }
}