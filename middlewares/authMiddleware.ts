import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    id?: string;
}

function isLoggedin(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token)
        return res.status(400).json({
            success: false,
            message: "No Token Provided!",
        });

    jwt.verify(token, process.env.JWT_SECRET || "", (err, decoded) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "Failed to authenticate token!",
            });
        }
        if (decoded && typeof decoded === "object" && "id" in decoded) {
            req.id = decoded.id;
        }
        next();
    });
}

export default isLoggedin;
