import { Request, Response } from "express";
import { authService } from "./auth.service";

const signUpUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const created = await authService.signUpUser({
      name,
      email,
      password,
      phone,
      role,
    });

    res.status(201).json({
      message: "User signed up successfully",
      data: created,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};


const signinUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.signinUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const authController = {
  signinUser,
  signUpUser,
};
