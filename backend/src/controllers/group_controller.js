import { getGroups, getMembers } from "../models/group_model.js";
const getGroupInformation = async (req, res, next) => {
    const gid = req.params.gid;
    const requirement = { gid };
    const [groupInformation] = await getGroups(requirement);
    console.log(groupInformation);
    return res.status(200).json({ data: groupInformation });
};

const getGroupMembers = async (req, res, next) => {
    const gid = req.params.gid;
    const groupMembers = await getMembers(gid);
    const memberIds = groupMembers.map((user) => user.uid);

    return res.status(200).json({ data: "ok" });
};
export { getGroupInformation, getGroupMembers };
