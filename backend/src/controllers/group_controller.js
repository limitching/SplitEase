import {
    getGroups,
    archiveGroup,
    getMembers,
    createGroup,
    editGroup,
    joinGroupViaCode,
    getGroupInformationViaCode,
} from "../models/group_model.js";
import { updateExpenseStatusByGroupId } from "../models/expense_model.js";
import User from "../models/user_model.js";
const getGroupInformation = async (req, res) => {
    const group_id = req.params.group_id;
    const requirement = { group_id };
    const [groupInformation] = await getGroups(requirement);
    return res.status(200).json({ data: groupInformation });
};

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
    const user_id = req.user.id;
    const group_id = req.params.group_id;
    const { deadline } = req.body;

    const requirement = { group_id };
    const [groupInformation] = await getGroups(requirement);
    if (user_id !== groupInformation.owner) {
        return res.status(400).json({
            error: "Unauthorized, this feature can only used by group owner.",
        });
    }
    //TODO: Local time issue
    console.log(new Date(deadline));
    const expenseResult = await updateExpenseStatusByGroupId(
        group_id,
        deadline,
        user_id
    );
    if (expenseResult.error) {
        return res.status(500).json("Internal DB error.");
    }
    // console.log(expenseResult);
    return res.status(200).json("Successfully update expense stage.");
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
};
