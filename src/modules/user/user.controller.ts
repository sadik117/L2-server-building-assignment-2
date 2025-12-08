import { Request, Response } from "express";
import { userService } from "./user.service";
import ApiError from "../../utils/ApiError";


// get
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

// update
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

// delete
const deleteUser = async (req: Request, res: Response) => {
  try {
    const authUser = req.user!;
    const { userId } = req.params;

    // Only admin can delete
    if (authUser.role !== "admin") {
      throw new ApiError(403, "Forbidden: Only admin can delete users");
    }

    // Check if user has active bookings
    const active = await userService.hasActiveBookings(Number(userId));
    if (active) {
      throw new ApiError(
        400,
        "User cannot be deleted because they have active bookings"
      );
    }

    // Delete user
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
  getUsers,
  updateUser,
  deleteUser
};