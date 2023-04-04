import { getGroups, getMembers } from "../models/group_model.js";
import { getUsers } from "../models/user_model.js";
const getGroupInformation = async (req, res, next) => {
    const gid = req.params.gid;
    const requirement = { gid };
    const [groupInformation] = await getGroups(requirement);
    console.log(groupInformation);
    return res.status(200).json({ data: groupInformation });
};

const getGroupMembers = async (req, res, next) => {
    const gid = req.params.gid;
    // Use gid to query group memberIds
    const groupMembers = await getMembers(gid);
    const memberIds = groupMembers.map((user) => user.uid);
    // Use memberIds to query user details
    const requirement = { uid: memberIds };
    const memberUsers = await getUsers(requirement);
    return res.status(200).json({ data: memberUsers });
};
export { getGroupInformation, getGroupMembers };
