import axios from "axios";
const HOST = "http://localhost:3000";

const api = {
    hostname: HOST + "/api/1.0",
    getMembers: async function (group_id) {
        const { data } = await axios.get(
            `${this.hostname}/group/members/${group_id}`
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
    getGroupExpenses: async function (group_id) {
        try {
            const { data } = await axios.get(
                `${this.hostname}/expense?group_id=${group_id}`
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
    deleteExpense: async function (expense_id, group_id) {
        try {
            const data = { expense_id, group_id };
            console.log(data);
            const result = await axios.delete(`${this.hostname}/expense`, {
                data: data,
            });
            return result;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    getGroupDebts: async function (group_id) {
        try {
            const { data } = await axios.get(
                `${this.hostname}/debts/${group_id}`
            );
            return data;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    userSignIn: async function (data) {
        try {
            const result = await axios.post(
                `${this.hostname}/user/signin`,
                data
            );
            return result;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    userSignUp: async function (data) {
        try {
            const result = await axios.post(
                `${this.hostname}/user/signup`,
                data
            );
            return result;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    getUserGroups: async function (jwtToken) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${jwtToken}` },
            };
            const response = await axios.get(
                `${this.hostname}/user/groups`,
                config
            );
            return response;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    createGroup: async function (jwtToken, newGroupData) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${jwtToken}` },
            };
            const response = await axios.post(
                `${this.hostname}/group`,
                newGroupData,
                config
            );
            return response;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    getGroupPublicInformation: async function (slug, invitation_code) {
        try {
            const response = await axios.get(
                `${this.hostname}/group/${slug}/join?invitation_code=${invitation_code}`
            );
            return response;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    getUserProfile: async function (jwtToken) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${jwtToken}` },
            };
            const response = await axios.get(
                `${this.hostname}/user/profile`,
                config
            );
            return response;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
};
export { api, HOST };
