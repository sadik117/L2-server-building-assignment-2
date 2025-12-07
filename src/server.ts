import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import config from "./config";
import { connectDB } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";

const app = express();

// parser
app.use(express.json());

// dotenv
dotenv.config({ path: path.join(process.cwd(), ".env") });

// DB Connection
connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Universe..!!");
});

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);


app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
