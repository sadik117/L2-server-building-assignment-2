import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import ApiError from "../../utils/ApiError";

// create booking customer or admin
const createBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    console.log(user);

    if (!user) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    const booking = await bookingService.createBooking({
      customer_id: user.id,
      vehicle_id: req.body.vehicle_id,
      rent_start_date: req.body.rent_start_date,
      rent_end_date: req.body.rent_end_date,
    });

    res.status(201).json({
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
      error: error,
    });
  }
};


// get bookings admin all && customer own, logic in service
const getBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    const bookings = await bookingService.getBookings(user.role, user.id);

    res.status(200).json({
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error: any) {
    const e: any = error;
    res.status(e.statusCode || 500).json({
      message: e.message || "Internal Server Error",
      error: e,
    });
  }
};



// update booking status: cancel by customer, return by admin
 const updateBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) throw new ApiError(401, "Unauthorized");

    const { status } = req.body;
    const bookingId = Number(req.params.bookingId);

    if (status === "cancelled") {
      if (user.role !== "customer") throw new ApiError(403, "Only customer can cancel");
      const result = await bookingService.cancelBooking(bookingId, user.id);
      return res.status(200).json(result);
    }

    if (status === "returned") {
      if (user.role !== "admin") throw new ApiError(403, "Only admin can return");
      const result = await bookingService.returnBooking(bookingId);
      return res.status(200).json(result);
    }

    throw new ApiError(400, "Invalid status value");
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message,
      error: { statusCode: error.statusCode, success: false },
    });
  }
};



export const bookingController = {
  createBooking,
  getBookings,
  updateBooking
};
