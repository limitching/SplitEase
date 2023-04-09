import { getMembers } from "../models/group_model.js";
import { getExpensesByGroupId } from "../models/expense_model.js";
const getGroupDebts = async (req, res, next) => {
    const gid = req.params.gid;
    const groupMembers = await getMembers(gid);
    const membersIndexMap = new Map();
    groupMembers.forEach((member, index) =>
        membersIndexMap.set(member.uid, index)
    );

    const debtsGraph = new Array(groupMembers.length);
    for (let i = 0; i < debtsGraph.length; i++) {
        debtsGraph[i] = new Array(groupMembers.length).fill(0);
    }
    const groupExpenses = await getExpensesByGroupId(gid);
    groupExpenses.forEach((expense) => {
        for (let [creditor, credit] of expense.credit_users) {
            for (let [debtor, debt] of expense.debt_users) {
                const creditorIndex = membersIndexMap.get(Number(creditor));
                const debtorIndex = membersIndexMap.get(Number(debtor));
                // Only calculate case: creditorIndex !== debtorIndex
                if (creditorIndex !== debtorIndex) {
                    debtsGraph[creditorIndex][debtorIndex] += debt;
                }
            }
        }
    });

    return res.status(200).json(debtsGraph);
};

export { getGroupDebts };
