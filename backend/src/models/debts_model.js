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

export { createSettlement, getSettlementsByGroupId, getSettlingByGroupId };
