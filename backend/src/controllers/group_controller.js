import { getGroups, getMembers } from "../models/group_model.js";
import User from "../models/user_model.js";
const getGroupInformation = async (req, res, next) => {
    const group_id = req.params.group_id;
    const requirement = { group_id };
    const [groupInformation] = await getGroups(requirement);
    return res.status(200).json({ data: groupInformation });
};

const getGroupMembers = async (req, res, next) => {
    const group_id = req.params.group_id;

    // Use gid to query group memberIds
    const groupUsers = await getMembers(group_id);
    const memberIds = groupUsers.map((user) => user.user_id);
    // Use memberIds to query user details
    const requirement = { uid: memberIds };
    const memberUsers = await User.getUsers(requirement);
    return res.status(200).json(memberUsers);
};
export { getGroupInformation, getGroupMembers };
