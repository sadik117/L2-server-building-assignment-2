import { pool } from "../../config/db";

interface VehiclePayload {
  vehicle_name?: string;
  type?: "car" | "bike" | "van" | "SUV";
  registration_number?: string;
  daily_rent_price?: number;
  availability_status?: "available" | "booked";
}

// helpers and service methods
const findAll = async () => {
  const result = await pool.query(`SELECT * FROM vehicles ORDER BY id DESC`);
  return result.rows;
};

const findById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

const hasActiveBookings = async (vehicleId: number) => {
  const result = await pool.query(
    `
        SELECT id FROM bookings 
        WHERE vehicle_id = $1 AND status = 'active'
      `,
    [vehicleId]
  );
  return (result.rowCount ?? 0) > 0;
};

// CRUD operations
const createVehicle = async (data: VehiclePayload) => {
  const query = `
      INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

  const values = [
    data.vehicle_name,
    data.type,
    data.registration_number,
    data.daily_rent_price,
    data.availability_status,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const updateVehicle = async (id: number, data: VehiclePayload) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in data) {
    fields.push(`${key} = $${index}`);
    values.push((data as any)[key]);
    index++;
  }

  const query = `
      UPDATE vehicles
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *
    `;

  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteVehicle = async (id: number) => {
  await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
};

export const vehicleService = {
  findAll,
  findById,
  hasActiveBookings,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
