import { ApiError } from "../middlewares/errorHandler.js";
import prisma from "../../prisma/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        if (!email || !password || !name) {
            throw new ApiError(400, "name,email and password is required")
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (existingUser) {
            throw new ApiError(401, "invalid credentials")
        }
        const hashPasword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashPasword,
                name

            }
        })

        console.log(`New user registered: id ${newUser.id}`)
        return res.status(201).json({ success: true, data: newUser })
    } catch (error) {
        next(error)
    }
}


export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password ) {
            throw new ApiError(400, "email and password is required")
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            console.log(`User not found , email : ${email}`)
            throw new ApiError(401, "Invalid email or password")
        }
        const isMatch = await   bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new ApiError(401, "Invalid username or password")
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );



        console.log(` token generated for user : id ${user.id}`)
        console.log(` User logged in : id ${user.id}`)

        return res.status(201).json({
            success: true, token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        next(error)
    }
}