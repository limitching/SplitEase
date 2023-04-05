import axios from "axios";
const HOST = "http://localhost:3000";

const api = {
    hostname: HOST + "/api/1.0",
    getMembers: async function (gid) {
        const { data } = await axios.get(
            `${this.hostname}/group/${gid}/members`
        );
        return data;
    },
    getCurrencies: async function () {
        const { data } = await axios.get(`${this.hostname}/currencies`);
        return data;
    },
    createExpense: async function (data) {
        const result = await axios.post(`${this.hostname}/expense`, data);
        return result;
    },
};
export { api };
