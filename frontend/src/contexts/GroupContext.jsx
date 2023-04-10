import { createContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/api";

const GroupContext = createContext({
    gid: null,
    members: [],
    memberMap: new Map(),
    groupExpense: [],
    debts: [],
    expensesChanged: false,
    setMembers: () => {},
    setExpensesChanged: () => {},
});

async function fetchMembers(gid, setMembers) {
    try {
        const data = await api.getMembers(gid);
        setMembers(data);
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

async function fetchGroupDebts(gid, setDebts) {
    try {
        const data = await api.getGroupDebts(gid);
        setDebts(data);
    } catch (error) {
        console.error(error);
    }
}

const GroupContextProvider = ({ children }) => {
    const { gid } = useParams();
    const [members, setMembers] = useState([]);
    const [groupExpense, setGroupExpense] = useState([]);
    const [debts, setDebts] = useState([]);
    const [expensesChanged, setExpensesChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        fetchMembers(gid, setMembers);
        fetchGroupExpenses(gid, setGroupExpense);
        fetchGroupDebts(gid, setDebts);
        setIsLoading(false);
    }, [gid]);

    useEffect(() => {
        if (expensesChanged) {
            setIsLoading(true);
            fetchGroupExpenses(gid, setGroupExpense);
            fetchGroupDebts(gid, setDebts);
            setIsLoading(false);
            setExpensesChanged(false);
        }
    }, [expensesChanged, gid]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const memberMap = members
        ? new Map(members.map((member) => [member.id, member]))
        : new Map();

    return (
        <GroupContext.Provider
            value={{
                gid,
                members,
                memberMap,
                groupExpense,
                debts,
                expensesChanged,
                setMembers,
                setExpensesChanged,
            }}
        >
            {children}
        </GroupContext.Provider>
    );
};

export { GroupContext, GroupContextProvider };
