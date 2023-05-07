import { pool } from "../databases/MySQL.database.js";
import { CURRENCY_MAP } from "../utils/constant.js";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/../../.env" });

const createSettlement = async (settlementData, user_id) => {
    const connection = await pool.getConnection();
    try {
        await connection.query("START TRANSACTION");
        await connection.query(
            "INSERT INTO `settlements` SET ?",
            settlementData
        );

        // Logs
        const logData = {
            user_id: user_id,
            group_id: settlementData.group_id,
            event: "marked debt as settled",
            event_target: `${settlementData.payer_id} to ${settlementData.payee_id}`,
            event_value: `${
                CURRENCY_MAP[settlementData.currency_option].symbol
            } ${settlementData.amount}`,
        };
        await connection.query("INSERT INTO `logs` SET ?", logData);

        await connection.query("COMMIT");
        return 0;
    } catch (error) {
        console.error(error);
        await connection.query("ROLLBACK");
        return -1;
    } finally {
        await connection.release();
    }
};

const getSettlementsByGroupId = async (group_id) => {
    try {
        const [settlements] = await pool.query(
            "SELECT * FROM `settlements` WHERE group_id = ?",
            [group_id]
        );
        return settlements;
    } catch (error) {
        console.error(error);
        return { error };
    }
};

const getSettlingByGroupId = async (group_id) => {
    try {
        const [settlements] = await pool.query(
            "SELECT * FROM `settlements` WHERE group_id = ? AND status = 0",
            [group_id]
        );
        return settlements;
    } catch (error) {
        console.error(error);
        return { error };
    }
};

const createCurrencyGraph = async (
    groupMembers,
    membersIndexMap,
    groupExpenses,
    currencyGraph,
    currencyTransactions
) => {
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
};

export {
    createSettlement,
    getSettlementsByGroupId,
    getSettlingByGroupId,
    createCurrencyGraph,
};
