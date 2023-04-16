import { pool } from "../databases/MySQL.database.js";
import bcrypt from "bcrypt";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/../../.env" });
const { PASSWORD_HASH_TIMES, LINE_CLIENT_ID, LINE_CLIENT_SECRET } = process.env;

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

        const [result] = await connection.query(
            "INSERT INTO users SET ?",
            user
        );
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

const nativeSignIn = async (email, password) => {
    const connection = await pool.getConnection();
    try {
        await connection.query("START TRANSACTION");
        const [result] = await connection.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        const user = result[0];

        if (!user) {
            await connection.query("COMMIT");
            return {
                error: "Request Error: Account does not exist",
                status: 400,
            };
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            await connection.query("COMMIT");
            return { error: "Request Error: password is wrong", status: 400 };
        }

        // Update last login time
        const loginAt = new Date();
        await connection.query("UPDATE users SET login_at = ? WHERE id = ?", [
            loginAt,
            user.id,
        ]);
        await connection.query("COMMIT");

        user.login_at = loginAt;

        return { user };
    } catch (error) {
        await connection.query("ROLLBACK");
        return { error, status: 500 };
    } finally {
        await connection.release();
    }
};

const lineSignIn = async (name, email, image, line_id) => {
    const connection = await pool.getConnection();
    try {
        const loginAt = new Date();
        const user = {
            provider: "line",
            name: name,
            email: email,
            image: image,
            line_id: line_id,
            login_at: loginAt,
        };
        const [users] = await connection.query(
            "SELECT id FROM users WHERE email = ? AND provider = 'line'",
            [email]
        );
        let userId;
        if (users.length === 0) {
            // Create new user
            const [result] = await connection.query(
                "INSERT INTO users SET ?",
                user
            );
            userId = result.insertId;
        } else {
            // Exist user login
            userId = users[0].id;
            await connection.query(
                "UPDATE users SET login_at = ? WHERE id = ?",
                [loginAt, userId]
            );
        }
        user.id = userId;
        return { user };
    } catch (error) {
        return { error };
    } finally {
        await connection.release();
    }
};

const getLineProfile = async (code, state) => {
    try {
        const uri = "https://api.line.me/oauth2/v2.1/token";
        const authData = {
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "http://localhost:3001/login",
            client_id: LINE_CLIENT_ID,
            client_secret: LINE_CLIENT_SECRET,
        };
        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        const { data } = await axios.post(uri, authData, config);

        const decoded = jwt.verify(data.id_token, LINE_CLIENT_SECRET);
        const user = {
            name: decoded.name,
            email: decoded.email,
            image: decoded.picture,
            line_id: decoded.sub,
        };
        return user;
    } catch (error) {
        console.error(error);
        throw "Permissions Error: LINE access code is wrong";
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

const getUserGroupsIds = async (id) => {
    const [groups] = await pool.query(
        "SELECT * FROM group_users WHERE user_id = ?",
        [id]
    );
    const groupsIds = groups.map((group) => group.group_id);
    return groupsIds;
};

const getGroupsInformation = async (groupsIds) => {
    const [groups] = await pool.query(
        "SELECT * FROM `groups` WHERE id = ? ORDER BY creation_date DESC",
        [groupsIds]
    );
    return groups;
};

export default {
    getUsers,
    signUp,
    nativeSignIn,
    getLineProfile,
    lineSignIn,
    getUserGroupsIds,
    getGroupsInformation,
};
