import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import verifyToken from "../../middleware/verifyToken";

const router = Router();

router.post("/", verifyToken, vehicleController.createVehicle);
router.get("/", vehicleController.getVehicles);
router.get("/:vehicleId", vehicleController.getVehicleById);
router.put("/:vehicleId", verifyToken, vehicleController.updateVehicle);
router.delete("/:vehicleId", verifyToken, vehicleController.deleteVehicle);

export const vehicleRoutes = router;