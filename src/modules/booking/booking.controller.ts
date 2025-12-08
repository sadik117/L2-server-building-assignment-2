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
    const e: any = error;
    res.status(e.statusCode || 500).json({
      message: e.message || "Internal Server Error",
      error: e,
    });
    console.log(e);
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


// booking cancellation by customer
const cancelBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    const result = await bookingService.cancelBooking(
      Number(req.params.bookingId),
      user.id
    );

    res.status(200).json(result);
  } catch (error: any) {
    const e: any = error;
    res.status(e.statusCode || 500).json({
      message: e.message || "Internal Server Error",
      error: e,
    });
  }
};

// return booking by admin only
const returnBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.returnBooking(
      Number(req.params.bookingId)
    );

    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message,
      error: error,
    });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  cancelBooking,
  returnBooking,
};
