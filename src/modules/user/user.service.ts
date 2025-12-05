import { pool } from "../../config/db";

const createUser = async ( name: string, email: string, password: string, phone: string, role: string ) => {
    const result = await pool.query(`
                INSERT INTO users (name, email, password, phone, role)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [name, email, password, phone, role]
            );
    return result;
};   

const getUsers = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    return result;
};

export const userService = {
    createUser, 
    getUsers
};