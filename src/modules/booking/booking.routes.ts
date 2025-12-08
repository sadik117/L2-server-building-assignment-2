import { Router } from "express";
import { bookingController } from "./booking.controller";
import verifyToken from "../../middleware/verifyToken";

const router = Router();

router.post("/", verifyToken, bookingController.createBooking);
router.get("/", verifyToken, bookingController.getBookings);
router.post("/:bookingId/cancel", verifyToken, bookingController.cancelBooking);
router.post("/:bookingId/return", verifyToken, bookingController.returnBooking);   

export const bookingRoutes = router;