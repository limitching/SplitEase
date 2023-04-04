import axios from "axios";
const HOST = "http://localhost:3000";

const api = {
    hostname: HOST + "/api/1.0",
    getMembers: async function (gid) {
        const { data } = await axios(`${this.hostname}/group/${gid}/members`);
        return data;
    },
    getCurrencies: async function () {
        const { data } = await axios(`${this.hostname}/currencies`);
        return data;
    },
};
export { api };
