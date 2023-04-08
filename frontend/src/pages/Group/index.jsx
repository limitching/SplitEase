import GroupDashboard from "./components/Dashboard";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../utils/api";
import { Outlet } from "react-router-dom";

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

async function fetchGroupExpenses(gid, setGroupExpense) {
    try {
        const data = await api.getGroupExpenses(gid);
        setGroupExpense(data);
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
    const [groupExpense, setGroupExpense] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [checked, setChecked] = useState([]);
    const [expenseTime, setExpenseTime] = useState(localISOTime);

    useEffect(() => {
        fetchMembers(gid, setMembers);
        fetchCurrencies(setCurrencies);
        fetchGroupExpenses(gid, setGroupExpense);
    }, []);

    useEffect(() => {
        if (members !== null) {
            setChecked([...members]);
        }
    }, [members]);

    return (
        <div>
            <GroupDashboard></GroupDashboard>
            <Outlet></Outlet>
        </div>
    );
};

export default Group;
