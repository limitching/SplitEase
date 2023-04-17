import { pool } from "../databases/MySQL.database.js";
import { v4 as uuidV4 } from "uuid";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/../../.env" });
const { HASH_ID_SALT } = process.env;
import Hashids from "hashids";
const hashids = new Hashids(HASH_ID_SALT, 10);

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
        const invitationCode = {
            invitation_code: hashids.encode(result.insertId),
        };
        // Insert invitation code via encoded group_id
        await connection.query("UPDATE `groups` SET ? WHERE id = ?", [
            invitationCode,
            result.insertId,
        ]);

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

const joinGroupViaCode = async (user_id, slug, invitation_code) => {
    const connection = await pool.getConnection();
    try {
        await connection.query("START TRANSACTION");
        const [group_id] = hashids.decode(invitation_code);
        if (!group_id) {
            return { error: "Invalid invitation code.", status: 400 };
        }
        const [result] = await connection.query(
            "SELECT * FROM `groups` WHERE id = ? ",
            group_id
        );
        const group = result[0];

        if (group.length === 0 || group.slug !== slug) {
            await connection.query("COMMIT");
            return { error: "Invalid invitation code.", status: 400 };
        }

        const [group_users] = await connection.query(
            "SELECT * FROM `group_users` WHERE group_id = ? ",
            group_id
        );
        if (group_users.length !== 0) {
            await connection.query("COMMIT");
            return group;
        }

        const newGroupUserData = {
            group_id: group.id,
            user_id: user_id,
            add_by_user: group.owner,
        };
        await connection.query(
            "INSERT INTO `group_users` SET ?",
            newGroupUserData
        );

        await connection.query("COMMIT");
        return group;
    } catch (error) {
        await connection.query("ROLLBACK");
        return { error, status: 500 };
    } finally {
        await connection.release();
    }
};

const getGroupInformationViaCode = async (slug, invitation_code) => {
    try {
        const [group_id] = hashids.decode(invitation_code);
        if (!group_id) {
            return { error: "Invalid invitation code.", status: 400 };
        }
        const [result] = await pool.query(
            "SELECT * FROM `groups` WHERE id = ? ",
            group_id
        );
        const group = result[0];
        if (group.length === 0 || group.slug !== slug) {
            return { error: "Invalid invitation code.", status: 400 };
        }
        return group;
    } catch (error) {
        return { error, status: 400 };
    }
};

export {
    getGroups,
    getMembers,
    createGroup,
    joinGroupViaCode,
    getGroupInformationViaCode,
};
