import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import ApiError from "../utils/ApiError";

const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "No token provided");
    }

    if (!config.jwt_secret) {
      throw new ApiError(500, "JWT secret is not configured");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token as string, config.jwt_secret as string);

    req.user = decoded as any;

    next();
    
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default verifyToken;