import { Router } from "express";
import { bookingController } from "./booking.controller";
import verifyToken from "../../middleware/verifyToken";

const router = Router();

router.post("/", verifyToken, bookingController.createBooking);
router.get("/", verifyToken, bookingController.getBookings);
router.put("/:bookingId", verifyToken, bookingController.updateBooking);   

export const bookingRoutes = router;