import { Request, Response } from "express";
import { userService } from "./user.service";
import ApiError from "../../utils/ApiError";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}


const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const created = await userService.createUser({ name, email, password, phone, role });

    res.status(201).json({
      message: "User created successfully",
      data: created
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      error: error
    });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.findAll();
    res.status(200).json({
      message: "Users fetched successfully",
      data: users
    });
  } catch (error: any) {
    res.status( 500).json({
      message: error.message || "Internal Server Error",
      error: error
    });
  }
};


const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authUser = req.user;

    if (!authUser) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    const isAdmin = authUser.role === "admin";
    const isOwner = authUser.id === Number(userId);

    if (!isAdmin && !isOwner) {
      throw new ApiError(403, "Forbidden: Cannot update another user");
    }

    const updatePayload = { ...req.body };
    if (updatePayload.email) updatePayload.email = updatePayload.email.toLowerCase();

    const updated = await userService.updateUser(Number(userId), updatePayload, isAdmin);

    res.status(200).json({
      message: "User updated successfully",
      data: updated
    });

  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error"
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await userService.deleteUser(Number(userId));

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error"
    });
  }
};

export const userController = {
  createUser,
  getUsers,
  updateUser,
  deleteUser
};