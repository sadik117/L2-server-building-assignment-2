import { Request, Response, Router } from "express";
import { pool } from "../../config/db";
import { userController } from "./user.controller";

const router = Router();

router.post("/", userController.createUser);

router.get("/", userController.getUsers);

export const userRoutes = router;