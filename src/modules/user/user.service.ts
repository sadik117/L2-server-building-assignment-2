import { pool } from "../../config/db";
import ApiError from "../../utils/ApiError";

interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: "admin" | "customer";
}

// helpers 
const findById = async (id: number) => {
  const result = await pool.query(
    `
    SELECT id, name, email, password, phone, role
    FROM users
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
};

const findByEmail = async (email: string) => {
  const result = await pool.query(
    `
    SELECT id, name, email, password, phone, role
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  return result.rows[0] || null;
};

const findAll = async () => {
  const result = await pool.query(`
    SELECT id, name, email, phone, role
    FROM users
    ORDER BY id DESC
  `);

  return result.rows;
};


// CRUD operations

const createUser = async (data: UpdateUserPayload) => {
 
  const email = data.email ? data.email.toLowerCase() : null;

  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
    `,
    [data.name ?? null, email, data.password ?? null, data.phone ?? null, data.role ?? null]
  );

  return result.rows[0];
};

const updateUser = async (id: number, data: UpdateUserPayload, isAdmin: boolean) => {

  // check user exists
  const user = await findById(id);
  if (!user) throw new ApiError(404, "User not found");

  //  email check duplicate
  if (data.email) {
    const existing = await findByEmail(data.email.toLowerCase());
    if (existing && existing.id !== id) {
      throw new ApiError(409, "Email already in use");
    }
    data.email = data.email.toLowerCase();
  }

  //  Prevent customer editing role
  if (!isAdmin && data.role) {
    delete data.role;
  }

  // Build dynamic SQL update
  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  for (const key in data) {
    if ((data as any)[key] === undefined) continue;
    fields.push(`${key} = $${index}`);
    values.push((data as any)[key]);
    index++;
  }

  if (fields.length === 0) return user;

  values.push(id);

  const result = await pool.query(
    `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING id, name, email, phone, role
    `,
    values
  );

  return result.rows[0];
};


const deleteUser = async (id: number) => {
  await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
};

const hasActiveBookings = async (userId: number) => {
  const result = await pool.query(
    `
    SELECT id FROM bookings
    WHERE customer_id = $1 AND status = 'active'
    `,
    [userId]
  );
  return (result.rowCount ?? 0) > 0;
};

export const userService = {
  createUser,
  findAll,
  findById,
  findByEmail,
  updateUser,
  deleteUser,
  hasActiveBookings,
};