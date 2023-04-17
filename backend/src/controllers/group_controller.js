import {
    getGroups,
    getMembers,
    createGroup,
    joinGroupViaCode,
    getGroupInformationViaCode,
} from "../models/group_model.js";
import User from "../models/user_model.js";
const getGroupInformation = async (req, res) => {
    const group_id = req.params.group_id;
    const requirement = { group_id };
    const [groupInformation] = await getGroups(requirement);
    return res.status(200).json({ data: groupInformation });
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
    const newGroupData = req.body;
    const result = await createGroup(newGroupData);
    if (result.status === 500) {
        return res
            .status(500)
            .json({ error: "Internal Server Error: MySQL error." });
    }
    return res.status(200).json(result.group);
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

export {
    getGroupInformation,
    getGroupMembers,
    createNewGroup,
    getPublicInformation,
    joinGroup,
};
