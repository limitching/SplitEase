import { pool } from "../databases/MySQL.database.js";

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
export { getGroups, getMembers };
