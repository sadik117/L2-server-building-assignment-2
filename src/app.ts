import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";

const app = express();

// parser
app.use(express.json());

// dotenv
dotenv.config({ path: path.join(process.cwd(), ".env") });

// DB Connection
connectDB();

// user routes
app.use("/api/v1/users", userRoutes);

// auth routes
app.use("/api/v1/auth", authRoutes);

// vehicle routes
app.use("/api/v1/vehicles", vehicleRoutes);

// booking routes
app.use("/api/v1/bookings", bookingRoutes);



app.get("/", (req: Request, res: Response) => {
  res.send("Hello Universe..!!");
});


export default app;