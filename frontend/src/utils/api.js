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
        try {
            const result = await axios.post(`${this.hostname}/expense`, data);
            return result;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    getGroupExpenses: async function (gid) {
        try {
            const { data } = await axios.get(
                `${this.hostname}/expense?gid=${gid}`
            );
            return data;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    updateExpense: async function (data) {
        try {
            const result = await axios.put(`${this.hostname}/expense`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return result;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    deleteExpense: async function (eid, gid) {
        try {
            const data = { eid, gid };
            const result = await axios.delete(`${this.hostname}/expense`, {
                data: data,
            });
            return result;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    getGroupDebts: async function (gid) {
        try {
            const { data } = await axios.get(`${this.hostname}/debts/${gid}`);
            return data;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
};
export { api, HOST };
