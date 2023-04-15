import { pool } from "../databases/MySQL.database.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/../../.env" });
const { PASSWORD_HASH_TIMES, TOKEN_EXPIRE, TOKEN_SECRET } = process.env;

const signUp = async (name, email, password) => {
    const connection = await pool.getConnection();
    try {
        const loginAt = new Date();

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            Number(PASSWORD_HASH_TIMES)
        );

        const user = {
            provider: "native",
            name: name,
            email: email,
            password: hashedPassword,
            login_at: loginAt,
        };

        const queryStr = "INSERT INTO users SET ?";
        const [result] = await connection.query(queryStr, user);
        user.id = result.insertId;

        return { user };
    } catch (error) {
        console.log(error);
        return {
            error: "Request Error: Email Already Exists",
            status: 403,
        };
    } finally {
        await connection.release();
    }
};

const getUsers = async (requirement) => {
    const condition = { sql: "", binding: [] };
    if (requirement.uid) {
        condition.sql = "WHERE id IN (?)";
        condition.binding = [requirement.uid];
    }
    const userQuery =
        "SELECT id, name, email, image FROM users " + condition.sql;
    const [users] = await pool.query(userQuery, condition.binding);
    return users;
};

export default { getUsers, signUp };
