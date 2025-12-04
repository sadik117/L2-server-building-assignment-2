import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import path from "path";

const app = express();
const port = 5000;

// parser
app.use(express.json());

// dotenv
dotenv.config({ path: path.join(process.cwd(), ".env") });

// DB
const pool = new Pool({
  connectionString: `${process.env.DB_CONNECTION_STR}`,
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
