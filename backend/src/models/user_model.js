import { pool } from "../databases/MySQL.database.js";

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

export { getUsers };
