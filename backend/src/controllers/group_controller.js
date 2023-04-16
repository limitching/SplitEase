import {
    getGroups,
    getMembers,
    createGroup,
    joinGroupViaCode,
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
    return res.status(200).json({ msg: "getPublicInformation" });
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
