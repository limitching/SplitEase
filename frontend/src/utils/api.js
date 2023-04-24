import axios from "axios";
import { API_HOST } from "../global/constant";

const api = {
    hostname: API_HOST + "/api/1.0",
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
    createExpense: async function (data, jwtToken) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${jwtToken}` },
            };
            const result = await axios.post(
                `${this.hostname}/expense`,
                data,
                config
            );
            return result;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    getGroupExpenses: async function (group_id, jwtToken) {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    "Content-Type": "multipart/form-data",
                },
            };
            const { data } = await axios.get(
                `${this.hostname}/expense?group_id=${group_id}`,
                config
            );
            return data;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    updateExpense: async function (data, jwtToken) {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    "Content-Type": "multipart/form-data",
                },
            };
            const result = await axios.put(
                `${this.hostname}/expense`,
                data,
                config
            );
            return result;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    deleteExpense: async function (expense_id, group_id, jwtToken) {
        try {
            const data = { expense_id, group_id };
            const result = await axios.delete(`${this.hostname}/expense`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
                data: data,
            });
            return result;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    getGroupDebts: async function (group_id, jwtToken) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${jwtToken}` },
            };
            const { data } = await axios.get(
                `${this.hostname}/debts/${group_id}`,
                config
            );
            return data;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    getSettlingGroupDebts: async function (group_id, jwtToken) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${jwtToken}` },
            };
            const { data } = await axios.get(
                `${this.hostname}/debts/${group_id}/settling`,
                config
            );
            return data;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    startSettlingGroupDebts: async function (
        group_id,
        startSettlingData,
        jwtToken
    ) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${jwtToken}` },
            };
            const response = await axios.post(
                `${this.hostname}/group/${group_id}/settle`,
                startSettlingData,
                config
            );
            return response;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    settleUpGroupDebts: async function (group_id, settlementData, jwtToken) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${jwtToken}` },
            };
            const { data } = await axios.post(
                `${this.hostname}/debts/${group_id}`,
                settlementData,
                config
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
                `${this.hostname}/user/groups?is_archived=0`,
                config
            );
            return response;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    getUserArchiveGroups: async function (jwtToken) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${jwtToken}` },
            };
            const response = await axios.get(
                `${this.hostname}/user/groups?is_archived=1`,
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
    editGroup: async function (jwtToken, modifiedGroupData) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${jwtToken}` },
            };
            const response = await axios.put(
                `${this.hostname}/group`,
                modifiedGroupData,
                config
            );
            return response;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    archiveGroup: async function (jwtToken, group_id) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${jwtToken}` },
            };
            const response = await axios.put(
                `${this.hostname}/group/${group_id}`,
                {},
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
    joinGroup: async function (slug, invitation_code, jwtToken) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${jwtToken}` },
            };
            const response = await axios.post(
                `${this.hostname}/group/${slug}/join`,
                { invitation_code: invitation_code },
                config
            );
            return response;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
};
export { api };
