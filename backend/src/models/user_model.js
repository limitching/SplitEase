import { pool } from "../databases/MySQL.database.js";
import bcrypt from "bcrypt";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import { AVATAR_LINK, DEFAULT_AVATAR } from "../utils/constant.js";
dotenv.config({ path: __dirname + "/../../.env" });
const {
  PASSWORD_HASH_TIMES,
  LINE_CLIENT_ID,
  LINE_CLIENT_SECRET,
  WEB_DEPLOY_URI,
} = process.env;

const { HASH_ID_SALT } = process.env;
import Hashids from "hashids";
const hashids = new Hashids(HASH_ID_SALT, 10);

const signUp = async (name, email, password) => {
  const connection = await pool.getConnection();
  try {
    await connection.query("START TRANSACTION");
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
      image:
        AVATAR_LINK +
        DEFAULT_AVATAR[Math.ceil(Math.random() * DEFAULT_AVATAR.length)],
    };

    const [result] = await connection.query("INSERT INTO users SET ?", user);
    user.id = result.insertId;

    const code = hashids.encode(result.insertId);
    const lineBindingCode = {
      line_binding_code: code,
    };
    // Insert line binding code via user_id
    await connection.query("UPDATE `users` SET ? WHERE id = ?", [
      lineBindingCode,
      result.insertId,
    ]);
    user.line_binding_code = code;
    await connection.query("COMMIT");
    return { user };
  } catch (error) {
    console.log(error);
    await connection.query("ROLLBACK");
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
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    let userId;
    await connection.query("START TRANSACTION");
    if (users.length === 0) {
      // Create new user
      const [result] = await connection.query("INSERT INTO users SET ?", user);
      userId = result.insertId;

      const code = hashids.encode(result.insertId);
      const lineBindingCode = {
        line_binding_code: code,
      };
      // Insert line binding code via user_id
      await connection.query("UPDATE `users` SET ? WHERE id = ?", [
        lineBindingCode,
        result.insertId,
      ]);
      user.line_binding_code = code;
    } else {
      // Exist user login
      userId = users[0].id;
      await connection.query(
        "UPDATE users SET line_id = ? , login_at = ? WHERE id = ?",
        [line_id, loginAt, userId]
      );
    }
    await connection.query("COMMIT");
    user.id = userId;
    console.log(user);
    user.line_binding_code = hashids.encode(userId);
    return { user };
  } catch (error) {
    await connection.query("ROLLBACK");
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
      redirect_uri: `${WEB_DEPLOY_URI}/login`,
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
    "SELECT id, name, email, image, line_id FROM users " + condition.sql;
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

const getGroupsInformation = async (groupsIds, is_archived) => {
  const [groups] = await pool.query(
    "SELECT * FROM `groups` WHERE id IN (?) AND is_archived = ? ORDER BY creation_date DESC",
    [groupsIds, is_archived]
  );
  return groups;
};

const updateProfile = async (user_id, modifiedUserProfile) => {
  try {
    await pool.query("UPDATE users SET ? WHERE id = ?", [
      modifiedUserProfile,
      user_id,
    ]);
    return { data: modifiedUserProfile };
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] User_id ${user_id} modify profile in error: ${error}`
    );
    return { error };
  }
};

const bindingLineUser = async (line_binding_code, source) => {
  try {
    const line_idData = { line_id: source.userId };
    const [result] = await pool.query(
      "UPDATE users SET ? WHERE line_binding_code =?",
      [line_idData, line_binding_code]
    );
    const [user] = await pool.query(
      "SELECT * FROM users WHERE line_binding_code = ?",
      [line_binding_code]
    );
    if (!user[0]?.name) {
      throw new Error("User not exist.");
    }
    const user_name = user[0]?.name;

    return { result: result.affectedRows, name: user_name };
  } catch (error) {
    console.log(error);
    return { error, result: -1 };
  }
};

const getBindingUser = async (source) => {
  try {
    const [user] = await pool.query("SELECT * FROM users WHERE line_id = ?", [
      source.userId,
    ]);
    if (user.length === 0) {
      return { result: 0 };
    }
    return user[0];
  } catch (error) {
    console.log(error);
    return { error, result: -1 };
  }
};

export default {
  getUsers,
  signUp,
  nativeSignIn,
  getLineProfile,
  lineSignIn,
  getUserGroupsIds,
  getGroupsInformation,
  updateProfile,
  bindingLineUser,
  getBindingUser,
};
