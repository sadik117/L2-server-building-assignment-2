import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/ApiError";

interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: "admin" | "customer";
}

const signUpUser = async (data: UpdateUserPayload) => {

  if (!data.password) {
    throw new ApiError(400, "Password is required");
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
 
  const email = data.email ? data.email.toLowerCase() : null;

  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
    `,
    [data.name ?? null, email, hashedPassword ?? null, data.phone ?? null, data.role ?? null]
  );

  return result.rows[0];

};

const signinUser = async (email: string, password: string) => {
  const result = await pool.query(
    `
      SELECT id, name, email, password, phone, role
      FROM users
      WHERE email = $1 AND password = $2
      `,
    [email, password]
  );

  if (result.rowCount === 0) {
    return null;
  }

  const user = result.rows[0];

  const matchPass = await bcrypt.compare(password, user.password);
  if (!matchPass) {
    return false;
  }

  const sercertKey = process.env.JWT_SECRET;
  const token = jwt.sign({ name: user.name, email: user.email }, sercertKey!, {
    expiresIn: "3d",
  });

  return { token, user };
};


export const authService = {
    signUpUser,
    signinUser
};
