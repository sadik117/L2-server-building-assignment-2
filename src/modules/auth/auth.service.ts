import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/ApiError";
import config from "../../config";

interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: "admin" | "customer";
}

// create user
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

// login user
const signinUser = async (email: string, password: string) => {
  email = email.toLowerCase();

  const result = await pool.query(
    `
      SELECT id, name, email, password, phone, role
      FROM users
      WHERE email = $1
    `,
    [email]
  );

  if (result.rowCount === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  // compare and match bcrypt hashed password
  const matchPass = await bcrypt.compare(password, user.password);
  if (!matchPass) {
    throw new Error("Invalid email or password");
  }

  // generate jwt token
  const secretKey = config.jwt_secret;
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    secretKey!,
    { expiresIn: "3d" }
  );

  // remove password before returning
  delete user.password;

  return { token, user };
};



export const authService = {
    signUpUser,
    signinUser
};
