import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from '@repo/backend-envs/config'

export const usermiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json({ msg: "No token present" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
        if(!decoded.id){
            return res.status(400).json({msg:"no jwt payload"})
        } 
        req.user = decoded.id;
        next();
    } catch (err) {
        return res.status(400).json({ msg: "Invalid token" });
    }
};
