import { getMembers } from "../models/group_model.js";
import { getExpensesByGroupId } from "../models/expense_model.js";
import { minimizeDebts } from "../models/debts_model.js";
const getGroupDebts = async (req, res, next) => {
    const gid = req.params.gid;
    const groupMembers = await getMembers(gid);
    const membersIndexMap = new Map();
    groupMembers.forEach((member, index) =>
        membersIndexMap.set(member.uid, index)
    );

    const currencyGraph = {};
    const currencyTransactions = {};

    const groupExpenses = await getExpensesByGroupId(gid);
    groupExpenses.forEach((expense) => {
        if (expense.currencyOption in currencyGraph === false) {
            const debtsGraph = new Array(groupMembers.length);
            for (let i = 0; i < debtsGraph.length; i++) {
                debtsGraph[i] = new Array(groupMembers.length).fill(0);
            }
            currencyGraph[expense.currencyOption] = debtsGraph;
            currencyTransactions[expense.currencyOption] = null;
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
                    currencyGraph[expense.currencyOption][creditorIndex][
                        debtorIndex
                    ] +=
                        ((creditorAmount - proportionAdjustAmount) * weight) /
                            totalWeight +
                        debtorAdjustAmount;
                }
            }
        }
    });
    for (const [currencyOption, graph] of Object.entries(currencyGraph)) {
        currencyTransactions[currencyOption] = minimizeDebts(graph);
    }

    return res.status(200).json(currencyTransactions);
};

export { getGroupDebts };
