import GroupDashboard from "./components/Dashboard";
import Tabs from "./components/Tabs";
import {
    GroupContextProvider,
    GroupContext,
} from "../../contexts/GroupContext";
import { useState, useEffect, useContext } from "react";
import { api } from "../../utils/api";
import { Outlet } from "react-router-dom";

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
    const { members, setMembers, gid } = useContext(GroupContext);
    const timeZoneOffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = new Date(Date.now() - timeZoneOffset)
        .toISOString()
        .substring(0, 16);

    const [groupExpense, setGroupExpense] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [checked, setChecked] = useState([]);
    const [expenseTime, setExpenseTime] = useState(localISOTime);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchGroupExpenses(gid, setGroupExpense);
        setIsLoading(false);
    }, [gid]);

    useEffect(() => {
        if (members !== null) {
            setChecked([...members]);
        }
    }, [members]);

    return (
        <GroupContextProvider>
            <div>
                <GroupDashboard></GroupDashboard>
                <Tabs></Tabs>
                <Outlet></Outlet>
            </div>
        </GroupContextProvider>
    );
};

export { Group };
