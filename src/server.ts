import express, { Request, Response } from "express";
import { Pool } from "pg";
import config from "./config";

const app = express();

// parser
app.use(express.json());

// DB
const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const connectDB = async () => {
  await pool.query(`   
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,

            name VARCHAR(100) NOT NULL,

            email VARCHAR(200) UNIQUE NOT NULL
             CHECK (email = LOWER(email)),

            password VARCHAR(200) NOT NULL
             CHECK (LENGTH(password) >= 6),

            phone VARCHAR(20) NOT NULL,

            role VARCHAR(20) NOT NULL
             CHECK (role IN ('admin', 'customer'))
             )`);
    };

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Universe..!!");
});

app.post("/", (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "Api is working fine",
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API not found!!",
  });
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
