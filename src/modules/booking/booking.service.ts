import { pool } from "../../config/db";
import ApiError from "../../utils/ApiError";

interface BookingPayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}


// create a booking
const createBooking = async (data: BookingPayload) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = data;

  // check vehicle by id
  const getVehicleById = async (vehicleId: number) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
      vehicleId,
    ]);
    return result.rows[0];
  };

  const vehicle = await getVehicleById(vehicle_id);
  if (!vehicle) throw new ApiError(404, "Vehicle not found");

  if (vehicle.availability_status === "booked") {
    throw new ApiError(400, "Vehicle is already booked");
  }

  // Duration calculation 
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  const diff = end.getTime() - start.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    throw new ApiError(400, "End date must be after start date");
  }

  const total_price = Number(vehicle.daily_rent_price) * days;

  // Insert booking in table
  const booking = await pool.query(
    `
    INSERT INTO bookings 
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING *
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  // Update vehicle status
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  const savedBooking = booking.rows[0];

  return {
    success: true,
    message: "Booking created successfully",
    data: {
      ...savedBooking,
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: vehicle.daily_rent_price,
      }
    }
  };
};



// Admin can get all && Customer can only own
const getBookings = async (role: string, userId: number) => {
  if (role === "admin") {
    const result = await pool.query(`SELECT * FROM bookings ORDER BY id DESC`);
    return result.rows;
  }

  const result = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 ORDER BY id DESC`,
    [userId]
  );
  return result.rows;
};



// customer's booking cancel
const cancelBooking = async (bookingId: number, userId: number) => {
  const booking = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
    bookingId,
  ]);

  if (booking.rowCount === 0) {
    throw new ApiError(404, "Booking not found");
  }

  const data = booking.rows[0];

  // customer can only cancel own booking
  if (data.customer_id !== userId) {
    throw new ApiError(403, "You cannot cancel this booking");
  }

  // Cannot cancel after start
  const today = new Date();
  const start = new Date(data.rent_start_date);
  if (today >= start) {
    throw new ApiError(400, "Booking already started. Cannot cancel.");
  }

  // cancel booking status
  await pool.query(`UPDATE bookings SET status = 'cancelled' WHERE id = $1`, [
    bookingId,
  ]);

  // change vehicle status to available
  await pool.query(
    `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
    [data.vehicle_id]
  );

  return { message: "Booking cancelled" };
};



// Admin return vehicle
const returnBooking = async (bookingId: number) => {
  const booking = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
    bookingId,
  ]);

  if (booking.rowCount === 0) {
    throw new ApiError(404, "Booking not found");
  }

  const data = booking.rows[0];

  await pool.query(`UPDATE bookings SET status = 'returned' WHERE id = $1`, [
    bookingId,
  ]);

  await pool.query(
    `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
    [data.vehicle_id]
  );

  return { message: "Vehicle returned successfully" };
};

export const bookingService = {
  createBooking,
  getBookings,
  cancelBooking,
  returnBooking,
};
