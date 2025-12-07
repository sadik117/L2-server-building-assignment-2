import { Router } from "express";
import { userController } from "./user.controller";
import verifyToken from "../../middleware/verifyToken";

const router = Router();

router.get("/", verifyToken, userController.getUsers);
router.put("/:userId", verifyToken, userController.updateUser);
router.delete("/:userId", verifyToken, userController.deleteUser);

export const userRoutes = router;