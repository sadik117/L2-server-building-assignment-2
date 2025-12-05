import { Request, Response, Router } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res:Response) => {
    try {  
        const { name, email, password, phone, role } = req.body;
        const result = await userService.createUser(name, email, password, phone, role);
        res.status(201).json({
            message: "User created successfully",
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
};

const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getUsers();
        res.status(200).json({
            message: "Users fetched successfully",
            data: result.rows
        });     
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
}

export const userController = {
    createUser,
    getUsers
};