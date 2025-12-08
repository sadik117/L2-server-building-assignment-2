import { Request, Response } from "express";
import ApiError from "../../utils/ApiError";
import { vehicleService } from "./vehicle.service";

// create vehicle only admin can create
const createVehicle = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      throw new ApiError(403, "Only admin can add vehicles");
    }

    const vehicle = await vehicleService.createVehicle(req.body);

    res.status(201).json({
      message: "Vehicle added successfully",
      data: vehicle,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ 
      message: error.messag,
      error: error
    });
  }
};

// get all vehicles
const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.findAll();

    res.status(200).json({
      message: "Vehicles fetched successfully",
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Internal Server Error",
      error: error
     });
  }
};

// get vehicle by id
 const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.findById(Number(req.params.vehicleId));

    if (!vehicle) throw new ApiError(404, "Vehicle not found");

    res.status(200).json({
      message: "Vehicle fetched successfully",
      data: vehicle,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ 
      message: error.message,
      error: error
    });
  }
};

// update vehicle admin only can
const updateVehicle = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      throw new ApiError(403, "Only admin can update vehicles");
    }

    const updated = await vehicleService.updateVehicle(
      Number(req.params.vehicleId),
      req.body
    );

    res.status(200).json({
      message: "Vehicle updated successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ 
      message: error.message,
      error: error
     });
  }
};

// delete vehicle admin only can
const deleteVehicle = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      throw new ApiError(403, "Only admin can delete vehicles");
    }

    const id = Number(req.params.vehicleId);

    const active = await vehicleService.hasActiveBookings(id);
    if (active) {
      throw new ApiError(
        400,
        "Vehicle cannot be deleted because it has active bookings"
      );
    }

    await vehicleService.deleteVehicle(id);

    res.status(200).json({
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ 
      message: error.message,
      error: error
     });
  }
};

export const vehicleController = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
