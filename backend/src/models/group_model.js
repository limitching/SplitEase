import { pool } from "../databases/MySQL.database.js";
import { v4 as uuidV4 } from "uuid";

const getGroups = async (requirement) => {
    const condition = { sql: "", binding: [] };
    if (requirement.group_id) {
        condition.sql = "WHERE id = ?";
        condition.binding = [requirement.group_id];
    }
    const groupQuery =
        "SELECT * FROM `groups` " + condition.sql + " ORDER BY name ";
    const [groups] = await pool.query(groupQuery, condition.binding);
    return groups;
};

const getMembers = async (group_id) => {
    const memberQuery =
        "SELECT user_id, add_date, add_by_user FROM `group_users` WHERE group_id = ?";
    const [members] = await pool.query(memberQuery, [group_id]);
    return members;
};

const createGroup = async (newGroupData) => {
    console.log("new", newGroupData);
    if (!newGroupData.slug) {
        newGroupData.slug = uuidV4();
    }

    const connection = await pool.getConnection();
    try {
        await connection.query("START TRANSACTION");
        const [result] = await connection.query(
            "INSERT INTO `groups` SET ?",
            newGroupData
        );
        newGroupData.id = result.insertId;
        const newGroupUserData = {
            group_id: result.insertId,
            user_id: newGroupData.owner,
            add_by_user: newGroupData.owner,
        };
        await connection.query(
            "INSERT INTO `group_users` SET ?",
            newGroupUserData
        );
        await connection.query("COMMIT");

        return { group: newGroupData };
    } catch (error) {
        await connection.query("ROLLBACK");
        return { error, status: 500 };
    } finally {
        await connection.release();
    }
};
export { getGroups, getMembers, createGroup };
