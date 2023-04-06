import Transaction from "./components/Transaction";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../utils/api";

async function fetchMembers(gid, setMembers) {
    try {
        const data = await api.getMembers(gid);
        setMembers(data);
    } catch (error) {
        console.error(error);
    }
}

async function fetchCurrencies(setCurrencies) {
    try {
        const data = await api.getCurrencies();
        setCurrencies(data);
    } catch (error) {
        console.error(error);
    }
}

const Group = () => {
    const { gid } = useParams();
    const timeZoneOffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = new Date(Date.now() - timeZoneOffset)
        .toISOString()
        .substring(0, 16);

    const [members, setMembers] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [checked, setChecked] = useState([]);
    const [expenseTime, setExpenseTime] = useState(localISOTime);

    useEffect(() => {
        fetchMembers(gid, setMembers);
        fetchCurrencies(setCurrencies);
    }, []);

    useEffect(() => {
        if (members !== null) {
            setChecked([...members]);
        }
    }, [members]);

    return (
        <div>
            <div
                className="group-information"
                style={{
                    display: "block",
                    width: "100%",
                    height: "300px",
                    backgroundColor: "blue",
                }}
            ></div>
            <h1 style={{ marginTop: "3rem" }}>Hello</h1>
            <Transaction
                gid={gid}
                members={members}
                currencies={currencies}
                checked={checked}
                setChecked={setChecked}
                expenseTime={expenseTime}
                setExpenseTime={setExpenseTime}
            />
        </div>
    );
};

export default Group;
