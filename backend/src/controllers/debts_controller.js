import { getMembers, getMember, getGroupUsersInformation, getGroupInformationById } from "../models/group_model.js";
import {
  getExpensesByGroupId,
  getSettlingExpensesByGroupId,
  updateExpenseStatusToSettled
} from "../models/expense_model.js";
import {
  createSettlement,
  getSettlementsByGroupId,
  getSettlingByGroupId,
  createCurrencyGraph
} from "../models/debts_model.js";
import { generateDebtNotify } from "../views/bot_reply_template.js";
import { minimizeDebts, minimizeTransaction } from "../models/split_model.js";
import { CURRENCY_MAP } from "../utils/constant.js";
import { customizedError } from "../utils/error.js";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/../../.env" });

const { LINE_CHANNEL_ACCESS_TOKEN } = process.env;

const getGroupDebts = async (req, res) => {
  const group_id = req.params.group_id;
  const groupMembers = await getMembers(group_id);
  const membersIndexMap = new Map();
  groupMembers.forEach((member, index) => membersIndexMap.set(member.user_id, index));

  const currencyGraph = {};
  const currencyTransactions = {};

  const group = await getGroupInformationById(group_id);
  const groupExpenses = await getExpensesByGroupId(group_id);
  const settlement = await getSettlementsByGroupId(group_id);
  const isMinimized = Number(group.minimized_debts);

  groupExpenses.forEach(expense => {
    if (!(expense.currency_option in currencyGraph)) {
      const debtsGraph = new Array(groupMembers.length);
      for (let i = 0; i < debtsGraph.length; i++) {
        debtsGraph[i] = new Array(groupMembers.length).fill(0);
      }
      currencyGraph[expense.currency_option] = debtsGraph;
      currencyTransactions[expense.currency_option] = null;
    }
    const weights = Array.from(expense.debtors_weight.values());
    const totalWeight = weights.reduce((acc, curr) => acc + curr, 0);
    const adjustments = Array.from(expense.debtors_adjustment.values());
    const totalAdjustments = adjustments.reduce((acc, curr) => acc + curr, 0);

    for (let [creditor, creditorAmount] of expense.creditors_amounts) {
      for (let [debtor, weight] of expense.debtors_weight) {
        const creditorIndex = membersIndexMap.get(Number(creditor));
        const debtorIndex = membersIndexMap.get(Number(debtor));
        const proportionAdjustAmount = (totalAdjustments * creditorAmount) / expense.amount;
        const debtorAdjustAmount = expense.debtors_adjustment.has(debtor) ? expense.debtors_adjustment.get(debtor) : 0;

        // Only calculate case: creditorIndex !== debtorIndex
        if (creditorIndex !== debtorIndex) {
          currencyGraph[expense.currency_option][creditorIndex][debtorIndex] +=
            ((creditorAmount - proportionAdjustAmount) * weight) / totalWeight + debtorAdjustAmount;
        }
      }
    }
  });

  const settlementTransactions = {};
  settlement.forEach(settlement => {
    if (!(settlement.currency_option in settlementTransactions)) {
      settlementTransactions[settlement.currency_option] = [];
    }
    const payerIndex = membersIndexMap.get(settlement.payer_id);
    const payeeIndex = membersIndexMap.get(settlement.payee_id);
    settlementTransactions[settlement.currency_option].push([payerIndex, payeeIndex, settlement.amount]);
  });

  for (const [currency_option, graph] of Object.entries(currencyGraph)) {
    if (settlementTransactions[currency_option]) {
      settlementTransactions[currency_option].forEach(settlement => {
        const payerIndex = settlement[0];
        const payeeIndex = settlement[1];
        const amount = settlement[2];
        graph[payerIndex][payeeIndex] += Number(amount);
      });
    }
    if (isMinimized === 0) {
      currencyTransactions[currency_option] = minimizeTransaction(graph);
    } else {
      currencyTransactions[currency_option] = minimizeDebts(graph);
    }
  }

  return res.status(200).json(currencyTransactions);
};

const getSettlingGroupDebts = async (req, res) => {
  const group_id = req.params.group_id;
  const groupMembers = await getMembers(group_id);
  const membersIndexMap = new Map();
  groupMembers.forEach((member, index) => membersIndexMap.set(member.user_id, index));

  const currencyGraph = {};
  const currencyTransactions = {};

  const group = await getGroupInformationById(group_id);
  const groupExpenses = await getSettlingExpensesByGroupId(group_id);
  const settlements = await getSettlingByGroupId(group_id);
  const isMinimized = Number(group.minimized_debts);

  await createCurrencyGraph(groupMembers, membersIndexMap, groupExpenses, currencyGraph, currencyTransactions);

  const settlementTransactions = {};
  settlements.forEach(settlement => {
    if (!(settlement.currency_option in settlementTransactions)) {
      settlementTransactions[settlement.currency_option] = [];
    }
    const payerIndex = membersIndexMap.get(settlement.payer_id);
    const payeeIndex = membersIndexMap.get(settlement.payee_id);
    settlementTransactions[settlement.currency_option].push([payerIndex, payeeIndex, settlement.amount]);
  });

  for (const [currency_option, graph] of Object.entries(currencyGraph)) {
    if (settlementTransactions[currency_option]) {
      settlementTransactions[currency_option].forEach(settlement => {
        const payerIndex = settlement[0];
        const payeeIndex = settlement[1];
        const amount = settlement[2];
        graph[payerIndex][payeeIndex] += Number(amount);
      });
    }

    if (isMinimized === 0) {
      currencyTransactions[currency_option] = minimizeTransaction(graph);
    } else {
      currencyTransactions[currency_option] = minimizeDebts(graph);
    }

    if (Object.keys(settlementTransactions).length === 0) {
      continue;
    }
  }
  // Check if all settled
  let isSettled = true;

  for (let currency_option in currencyTransactions) {
    if (currencyTransactions[currency_option].length !== 0) {
      isSettled = false;
      break;
    }
  }

  if (isSettled && settlements.length !== 0) {
    await updateExpenseStatusToSettled(group_id);
  }

  return res.status(200).json(currencyTransactions);
};

const settleUpDebts = async (req, res, next) => {
  const user_id = req.user.id;
  const group_id = req.params.group_id;
  const groupMember = await getMember(group_id, user_id);
  if (groupMember.length === 0) {
    return next(customizedError.unauthorized("Unauthorized: Only group members can settle the debts."));
  }
  const settlementData = req.body;
  settlementData.group_id = group_id;
  const settlementResult = await createSettlement(settlementData, user_id);
  if (settlementResult === -1) {
    return next(customizedError.internal("Server Error: Database Query Error"));
  }

  return res.status(200).json({ msg: "SettleUp Successfully!" });
};

const notifyUserDebt = async (req, res, next) => {
  const user_id = req.user.id;
  const group_id = req.params.group_id;
  const { debtor_id, creditor_id, currency_option, amount } = req.body;

  const group = await getGroupInformationById(group_id);
  if (!group) {
    return next(customizedError.badRequest("Bad Request. Group not exist."));
  }
  if (group.error) {
    return next(customizedError.internal("Server Error: Database Query Error"));
  }

  const groupUsers = await getGroupUsersInformation(group_id);
  if (groupUsers.length < 2) {
    return next(customizedError.badRequest("Bad Request. User not exist."));
  }
  if (groupUsers.error) {
    return next(customizedError.internal("Server Error: Database Query Error"));
  }
  const [user] = groupUsers.filter(user => user.id === user_id);
  const [debtor] = groupUsers.filter(user => user.id === debtor_id);
  const [creditor] = groupUsers.filter(user => user.id === creditor_id);
  if (!user || !debtor || !creditor) {
    return next(customizedError.badRequest("Bad Request. User not exist."));
  }

  if (!debtor.line_id) {
    return next(customizedError.badRequest(`${debtor.name} has not bound line id.`));
  }

  const replyBody = generateDebtNotify(debtor.name, creditor.name, CURRENCY_MAP[currency_option].symbol, amount);

  const message = {
    to: debtor.line_id,
    messages: [
      {
        type: "flex",
        altText: "[Important] Debt Notification",
        contents: replyBody
      }
    ]
  };

  try {
    const config = {
      headers: { Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}` }
    };
    await axios.post(`https://api.line.me/v2/bot/message/push`, message, config);
    return res.status(200).json({ msg: "Successfully notify" });
  } catch (error) {
    console.error(error.response);
    return next(customizedError.internal("Server Error: LINE Server Error"));
  }
};

export { getGroupDebts, getSettlingGroupDebts, settleUpDebts, notifyUserDebt };
