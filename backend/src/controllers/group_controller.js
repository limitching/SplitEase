import {
    getGroups,
    archiveGroup,
    getMembers,
    getMember,
    createGroup,
    editGroup,
    joinGroupViaCode,
    getGroupInformationViaCode,
    getLogs,
    getGroupInformationById,
} from "../models/group_model.js";
import { generateStartSettlingNotification } from "../models/bot_model.js";
import { updateExpenseStatusByGroupId } from "../models/expense_model.js";
import User from "../models/user_model.js";
const getGroupInformation = async (req, res) => {
    const group_id = req.params.group_id;
    const requirement = { group_id };
    const [groupInformation] = await getGroups(requirement);
    return res.status(200).json({ data: groupInformation });
};
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/../../.env" });

const { LINE_CHANNEL_ACCESS_TOKEN } = process.env;

const archiveExistingGroup = async (req, res) => {
    const user_id = req.user.id;
    const group_id = req.params.group_id;
    const archiveResult = await archiveGroup(group_id, user_id);
    if (archiveResult === -1) {
        return res.status(500).json({ error: "Internal server error." });
    }
    return res.status(200).json({ msg: "Successfully archived." });
};

const getGroupMembers = async (req, res) => {
    const group_id = req.params.group_id;

    // Use gid to query group memberIds
    const groupUsers = await getMembers(group_id);
    const memberIds = groupUsers.map((user) => user.user_id);
    // Use memberIds to query user details
    const requirement = { uid: memberIds };
    const memberUsers = await User.getUsers(requirement);
    return res.status(200).json(memberUsers);
};

const createNewGroup = async (req, res) => {
    const user_id = req.user.id;
    const newGroupData = req.body;
    const result = await createGroup(newGroupData, user_id);
    if (result.status === 500) {
        return res
            .status(500)
            .json({ error: "Internal Server Error: MySQL error." });
    }
    return res.status(200).json(result.group);
};

const editExistingGroup = async (req, res) => {
    const user_id = req.user.id;
    const modifiedGroupData = req.body;
    const result = await editGroup(modifiedGroupData, user_id);
    if (result.status === 500) {
        return res
            .status(500)
            .json({ error: "Internal Server Error: MySQL error." });
    }
    return res.status(200).json(modifiedGroupData);
};

const getPublicInformation = async (req, res) => {
    const slug = req.params.slug;
    const { invitation_code } = req.query;
    const group = await getGroupInformationViaCode(slug, invitation_code);
    if (group.error) {
        return res.status(400).json({ error: group.error });
    }
    const groupUsers = await getMembers(group.id);
    if (groupUsers.length === 0) {
        return res
            .status(400)
            .json({ error: "Request Error: Group not exist." });
    }
    const userIds = groupUsers.map((user) => user.user_id);
    const requirement = { uid: userIds };
    const memberUsers = await User.getUsers(requirement);
    if (memberUsers.length === 0) {
        return res
            .status(500)
            .json({ error: "Internal Server Error: User not exist." });
    }
    return res.status(200).json({ group: group, members: memberUsers });
};

const joinGroup = async (req, res) => {
    const slug = req.params.slug;
    const { invitation_code } = req.body;
    const { user } = req;
    const group = await joinGroupViaCode(user.id, slug, invitation_code);
    return res.status(200).json(group);
};

const startSettlement = async (req, res) => {
    const user = req.user;
    const group_id = req.params.group_id;
    const { deadline } = req.body;

    const group = await getGroupInformationById(group_id);
    if (user.id !== group.owner) {
        return res.status(400).json({
            error: "Unauthorized, this feature can only used by group owner.",
        });
    }
    //TODO: Local time issue
    console.log("DEADLINE", deadline);
    console.log("toLocaleString", new Date(deadline).toLocaleString());
    const expenseResult = await updateExpenseStatusByGroupId(
        group_id,
        deadline,
        user.id
    );
    if (expenseResult.error) {
        return res.status(500).json("Internal DB error.");
    }

    if (!group.line_id) {
        return res.status(200).json("Successfully update expense stage.");
    }

    const replyBody = generateStartSettlingNotification(group, user, deadline);

    const message = {
        to: group.line_id,
        messages: [
            {
                type: "flex",
                altText: "[Important] Start Settling Notification",
                contents: replyBody,
            },
        ],
    };

    try {
        const config = {
            headers: { Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}` },
        };
        const { data } = await axios.post(
            `https://api.line.me/v2/bot/message/push`,
            message,
            config
        );
        return res
            .status(200)
            .json("Successfully update expense stage. (With LINE notify)");
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Server side error. (LINE Server error)" });
    }
};

const getGroupLogs = async (req, res) => {
    const user_id = req.user.id;
    const group_id = req.params.group_id;

    const member = await getMember(group_id, user_id);
    if (member.length === 0) {
        return res.status(400).json({
            error: "Unauthorized, only group member can access logs.",
        });
    }

    const logs = await getLogs(group_id);
    if (logs.error) {
        return res.status(500).json({ error: "Internal Server Error (MySQL)" });
    }

    return res.status(200).json(logs);
};

export {
    getGroupInformation,
    archiveExistingGroup,
    getGroupMembers,
    createNewGroup,
    getPublicInformation,
    joinGroup,
    editExistingGroup,
    startSettlement,
    getGroupLogs,
};
