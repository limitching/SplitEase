import { createContext, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { api } from "../utils/api";

const GroupContext = createContext({
    group: {},
    group_id: null,
    members: [],
    memberMap: new Map(),
    indexMap: new Map(),
    groupExpense: [],
    debts: [],
    expensesChanged: false,
    setMembers: () => {},
    setExpensesChanged: () => {},
});

async function fetchMembers(group_id, setMembers) {
    try {
        const data = await api.getMembers(group_id);
        setMembers(data);
    } catch (error) {
        console.error(error);
    }
}

async function fetchGroupExpenses(group_id, setGroupExpense) {
    try {
        const data = await api.getGroupExpenses(group_id);
        setGroupExpense(data);
    } catch (error) {
        console.error(error);
    }
}

async function fetchGroupDebts(group_id, setDebts) {
    try {
        const data = await api.getGroupDebts(group_id);
        setDebts(data);
    } catch (error) {
        console.error(error);
    }
}

const GroupContextProvider = ({ children }) => {
    const { userGroups } = useContext(AuthContext);

    const { slug } = useParams();
    const [selectedGroup] = userGroups.filter((group) => group.slug === slug);
    const group_id = selectedGroup.id;
    const [members, setMembers] = useState([]);
    const [groupExpense, setGroupExpense] = useState([]);
    const [debts, setDebts] = useState([]);
    const [expensesChanged, setExpensesChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [group, setGroup] = useState(selectedGroup);

    useEffect(() => {
        setIsLoading(true);
        fetchMembers(group_id, setMembers);
        fetchGroupExpenses(group_id, setGroupExpense);
        fetchGroupDebts(group_id, setDebts);
        setIsLoading(false);
    }, [group_id]);

    useEffect(() => {
        if (expensesChanged) {
            setIsLoading(true);
            fetchGroupExpenses(group_id, setGroupExpense);
            fetchGroupDebts(group_id, setDebts);
            setIsLoading(false);
            setExpensesChanged(false);
        }
    }, [expensesChanged, group_id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // A map to get member object from memberId
    const memberMap = members
        ? new Map(members.map((member) => [member.id, member]))
        : new Map();

    const indexMap = members
        ? new Map(members.map((member, index) => [member.id, index]))
        : new Map();

    return (
        <GroupContext.Provider
            value={{
                group,
                group_id,
                members,
                memberMap,
                indexMap,
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
