import axios from "axios";
import { API_HOST } from "../global/constant";

const api = {
  hostname: API_HOST + "/api/1.0",
  getMembers: async function (group_id) {
    const { data } = await axios.get(`${this.hostname}/group/members/${group_id}`);
    return data;
  },
  getCurrencies: async function () {
    const { data } = await axios.get(`${this.hostname}/currencies`);
    return data;
  },
  createExpense: async function (data, jwtToken) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      return await axios.post(`${this.hostname}/expense`, data, config);
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
          "Content-Type": "multipart/form-data"
        }
      };
      const { data } = await axios.get(`${this.hostname}/expense?group_id=${group_id}`, config);
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
          "Content-Type": "multipart/form-data"
        }
      };
      return await axios.put(`${this.hostname}/expense`, data, config);
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  deleteExpense: async function (expense_id, group_id, jwtToken) {
    try {
      const data = { expense_id, group_id };
      return await axios.delete(`${this.hostname}/expense`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
        data: data
      });
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  getGroupDebts: async function (group_id, jwtToken) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      const { data } = await axios.get(`${this.hostname}/debts/${group_id}`, config);
      return data;
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  getSettlingGroupDebts: async function (group_id, jwtToken) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      const { data } = await axios.get(`${this.hostname}/debts/${group_id}/settling`, config);
      return data;
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  startSettlingGroupDebts: async function (group_id, startSettlingData, jwtToken) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      return await axios.post(`${this.hostname}/group/${group_id}/settle`, startSettlingData, config);
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  settleUpGroupDebts: async function (group_id, settlementData, jwtToken) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      const response = await axios.post(`${this.hostname}/debts/${group_id}`, settlementData, config);
      return response;
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },

  userSignIn: async function (data) {
    try {
      return await axios.post(`${this.hostname}/user/signin`, data);
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  userSignUp: async function (data) {
    try {
      return await axios.post(`${this.hostname}/user/signup`, data);
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  getUserGroups: async function (jwtToken) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      return await axios.get(`${this.hostname}/user/groups?is_archived=0`, config);
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  getUserArchiveGroups: async function (jwtToken) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      return await axios.get(`${this.hostname}/user/groups?is_archived=1`, config);
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  createGroup: async function (jwtToken, newGroupData) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      return await axios.post(`${this.hostname}/group`, newGroupData, config);
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  editGroup: async function (jwtToken, modifiedGroupData, group_id) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      return await axios.put(`${this.hostname}/group/${group_id}`, modifiedGroupData, config);
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  archiveGroup: async function (jwtToken, group_id) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      return await axios.delete(`${this.hostname}/group/${group_id}`, config);
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  getGroupPublicInformation: async function (slug, invitation_code) {
    try {
      return await axios.get(`${this.hostname}/group/${slug}/join?invitation_code=${invitation_code}`);
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  getUserProfile: async function (jwtToken) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      return await axios.get(`${this.hostname}/user/profile`, config);
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  joinGroup: async function (slug, invitation_code, jwtToken) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      return await axios.post(`${this.hostname}/group/${slug}/join`, { invitation_code: invitation_code }, config);
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  getGroupLogs: async function (jwtToken, group_id) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      const { data } = await axios.get(`${this.hostname}/group/${group_id}/logs`, config);
      return data;
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  getPreSignedUrl: async function (jwtToken) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      const { data } = await axios.get(`${this.hostname}/s3url`, config);
      return data;
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  putImageToS3: async function (url, imageFile) {
    try {
      const config = {
        headers: {
          "Content-Type": imageFile.type
        }
      };
      await axios.put(url, imageFile, config);
      const imageUrl = url.split("?")[0];
      return { imageUrl };
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  updateProfile: async function (jwtToken, modifiedUserData) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      const { data } = await axios.post(`${this.hostname}/user/profile`, modifiedUserData, config);
      return data;
    } catch (error) {
      console.error(error);
      return error.response.data;
    }
  },
  notifyDebtor: async function (jwtToken, notifyData, group_id) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwtToken}` }
      };
      return await axios.post(`${this.hostname}/debts/${group_id}/notification`, notifyData, config);
    } catch (error) {
      console.error(error.response);
      return error.response.data;
    }
  }
};
export { api };
