import { getMembers, getMember } from "../models/group_model.js";
import {
    getExpensesByGroupId,
    getSettlingExpensesByGroupId,
} from "../models/expense_model.js";
import {
    createSettlement,
    getSettlementsByGroupId,
} from "../models/debts_model.js";
import { minimizeDebts } from "../models/split_model.js";
const getGroupDebts = async (req, res) => {
    const group_id = req.params.group_id;
    const groupMembers = await getMembers(group_id);
    const membersIndexMap = new Map();
    groupMembers.forEach((member, index) =>
        membersIndexMap.set(member.user_id, index)
    );

    const currencyGraph = {};
    const currencyTransactions = {};

    const groupExpenses = await getExpensesByGroupId(group_id);

    groupExpenses.forEach((expense) => {
        if (expense.currency_option in currencyGraph === false) {
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
        const totalAdjustments = adjustments.reduce(
            (acc, curr) => acc + curr,
            0
        );

        for (let [creditor, creditorAmount] of expense.creditors_amounts) {
            for (let [debtor, weight] of expense.debtors_weight) {
                const creditorIndex = membersIndexMap.get(Number(creditor));
                const debtorIndex = membersIndexMap.get(Number(debtor));
                const proportionAdjustAmount =
                    (totalAdjustments * creditorAmount) / expense.amount;
                const debtorAdjustAmount = expense.debtors_adjustment.has(
                    debtor
                )
                    ? expense.debtors_adjustment.get(debtor)
                    : 0;

                // Only calculate case: creditorIndex !== debtorIndex
                if (creditorIndex !== debtorIndex) {
                    currencyGraph[expense.currency_option][creditorIndex][
                        debtorIndex
                    ] +=
                        ((creditorAmount - proportionAdjustAmount) * weight) /
                            totalWeight +
                        debtorAdjustAmount;
                }
            }
        }
    });
    for (const [currency_option, graph] of Object.entries(currencyGraph)) {
        currencyTransactions[currency_option] = minimizeDebts(graph);
    }

    return res.status(200).json(currencyTransactions);
};

const getSettlingGroupDebts = async (req, res) => {
    const group_id = req.params.group_id;
    const groupMembers = await getMembers(group_id);
    const membersIndexMap = new Map();
    groupMembers.forEach((member, index) =>
        membersIndexMap.set(member.user_id, index)
    );

    const currencyGraph = {};
    const currencyTransactions = {};

    const groupExpenses = await getSettlingExpensesByGroupId(group_id);
    const settlement = await getSettlementsByGroupId(group_id);
    // TODO:
    // console.log(settlement);

    groupExpenses.forEach((expense) => {
        if (expense.currency_option in currencyGraph === false) {
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
        const totalAdjustments = adjustments.reduce(
            (acc, curr) => acc + curr,
            0
        );

        for (let [creditor, creditorAmount] of expense.creditors_amounts) {
            for (let [debtor, weight] of expense.debtors_weight) {
                const creditorIndex = membersIndexMap.get(Number(creditor));
                const debtorIndex = membersIndexMap.get(Number(debtor));
                const proportionAdjustAmount =
                    (totalAdjustments * creditorAmount) / expense.amount;
                const debtorAdjustAmount = expense.debtors_adjustment.has(
                    debtor
                )
                    ? expense.debtors_adjustment.get(debtor)
                    : 0;

                // Only calculate case: creditorIndex !== debtorIndex
                if (creditorIndex !== debtorIndex) {
                    currencyGraph[expense.currency_option][creditorIndex][
                        debtorIndex
                    ] +=
                        ((creditorAmount - proportionAdjustAmount) * weight) /
                            totalWeight +
                        debtorAdjustAmount;
                }
            }
        }
    });

    const settlementTransactions = {};
    // TODO:
    // console.log(membersIndexMap);
    settlement.forEach((settlement) => {
        if (settlement.currency_option in settlementTransactions === false) {
            settlementTransactions[settlement.currency_option] = [];
        }
        const payerIndex = membersIndexMap.get(settlement.payer_id);
        const payeeIndex = membersIndexMap.get(settlement.payee_id);
        settlementTransactions[settlement.currency_option].push([
            payerIndex,
            payeeIndex,
            settlement.amount,
        ]);
    });
    // TODO:
    // console.log(currencyGraph);
    for (const [currency_option, graph] of Object.entries(currencyGraph)) {
        currencyTransactions[currency_option] = minimizeDebts(graph);
        for (
            let i = 0;
            i < settlementTransactions[currency_option].length;
            i++
        ) {
            const settledDebt = settlementTransactions[currency_option][i];
            for (
                let j = 0;
                j < currencyTransactions[currency_option].length;
                j++
            ) {
                const debt = currencyTransactions[currency_option][j];
                if (settledDebt.toString() === debt.toString()) {
                    currencyTransactions[currency_option].splice(j, 1);
                    break;
                }
            }
        }
    }

    return res.status(200).json(currencyTransactions);
};

const settleUpDebts = async (req, res) => {
    const user_id = req.user.id;
    const group_id = req.params.group_id;
    const groupMember = await getMember(group_id, user_id);
    if (groupMember.length === 0) {
        return res.status(400).json({
            error: "Unauthorized: Only group members can settle the debts.",
        });
    }
    const settlementData = req.body;
    settlementData.group_id = group_id;
    const settlementResult = await createSettlement(settlementData);
    if (settlementResult === -1) {
        return res.status(500).json({ error: "Internal Server Error: MySQL" });
    }

    return res.status(200).json("hello");
};

export { getGroupDebts, getSettlingGroupDebts, settleUpDebts };
