import { pool } from "../databases/MySQL.database.js";

const getGroups = async (requirement) => {
    const condition = { sql: "", binding: [] };
    if (requirement.gid) {
        condition.sql = "WHERE gid = ?";
        condition.binding = [requirement.gid];
    }
    const groupQuery =
        "SELECT * FROM groups_main " + condition.sql + " ORDER BY name ";
    const [groups] = await pool.query(groupQuery, condition.binding);
    return groups;
};

const getMembers = async (gid) => {
    const memberQuery =
        "SELECT uid, add_date, add_by FROM group_members WHERE gid = ?";
    const [members] = await pool.query(memberQuery, [gid]);
    return members;
};
export { getGroups, getMembers };
