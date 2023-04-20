import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { api } from "../utils/api";
import Loading from "../components/Loading";

const GroupContext = createContext({
    slug: null,
    invitation_code: null,
    group: {},
    group_id: null,
    members: [],
    memberMap: new Map(),
    indexMap: new Map(),
    groupExpense: [],
    debts: [],
    expensesChanged: false,
    isPublicVisit: false,
    error: null,
    inviteEmail: "",
    balance: [],
    spent: [],
    usersShare: [],
    setMembers: () => {},
    setExpensesChanged: () => {},
    setInviteEmail: () => {},
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

async function fetchGroupPublicInformation(
    slug,
    invitation_code,
    setGroup,
    setMembers,
    setError,
    setIsPublicVisit
) {
    const response = await api.getGroupPublicInformation(slug, invitation_code);
    console.log("response", response);
    if (response.data.error) {
        return setError(response.data.error);
    }
    setGroup(response.data.group);
    setMembers(response.data.members);
    setIsPublicVisit(true);
}

const GroupContextProvider = ({ children }) => {
    const location = useLocation();
    const { userGroups } = useContext(AuthContext);
    const { slug } = useParams();

    const [group_id, setGroup_id] = useState(null);
    const [members, setMembers] = useState([]);
    const [groupExpense, setGroupExpense] = useState([]);
    const [debts, setDebts] = useState([]);
    const [expensesChanged, setExpensesChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [group, setGroup] = useState({});
    const [invitation_code, setInvitation_code] = useState(null);
    const [isPublicVisit, setIsPublicVisit] = useState(false);
    const [error, setError] = useState(null);
    const [inviteEmail, setInviteEmail] = useState("");
    const [balance, setBalance] = useState([]);
    const [spent, setSpent] = useState([]);
    const [usersShare, setUsersShare] = useState([]);

    // A map to get member object from memberId
    const memberMap = members
        ? new Map(members.map((member) => [member.id, member]))
        : new Map();

    const indexMap = useMemo(
        () =>
            members
                ? new Map(members.map((member, index) => [member.id, index]))
                : new Map(),
        [members]
    );

    useMemo(() => {
        const searchParams = new URLSearchParams(location.search);
        const queryInvitationCode = searchParams.get("invitation_code");
        if (queryInvitationCode) {
            setInvitation_code(queryInvitationCode);
        }
    }, [location.search]);

    useEffect(() => {
        if (invitation_code) {
            setIsLoading(true);
            fetchGroupPublicInformation(
                slug,
                invitation_code,
                setGroup,
                setMembers,
                setError,
                setIsPublicVisit
            );

            setIsLoading(false);
        }
    }, [invitation_code, slug]);

    useEffect(() => {
        if (userGroups.length !== 0) {
            const [selectedGroup] = userGroups.filter(
                (group) => group.slug === slug
            );
            if (selectedGroup) {
                setIsLoading(true);
                setGroup(selectedGroup);
                setGroup_id(selectedGroup.id);
                setIsPublicVisit(false);
                setIsLoading(false);
            }
        }
    }, [isPublicVisit, slug, userGroups]);

    useEffect(() => {
        if (group_id !== null) {
            setIsLoading(true);
            fetchMembers(group_id, setMembers);
            fetchGroupExpenses(group_id, setGroupExpense);
            fetchGroupDebts(group_id, setDebts);
            setIsLoading(false);
        }
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
    useEffect(() => {
        if (!debts[group.default_currency]) {
            const newBalance = new Array(members.length).fill(0);
            setBalance(newBalance);
        }
        if (members.length !== 0 && debts[group.default_currency]) {
            setIsLoading(true);
            let newBalance = new Array(members.length).fill(0);

            debts[group.default_currency].forEach(
                ([debtorIndex, creditorIndex, amount]) => {
                    newBalance[debtorIndex] -= amount;
                    newBalance[creditorIndex] += amount;
                }
            );
            //TODO:
            newBalance = newBalance.map((balance) =>
                Number(balance.toFixed(2))
            );
            setBalance(newBalance);
            setIsLoading(false);
        }
    }, [debts, group.default_currency, members.length]);

    useEffect(() => {
        if (groupExpense) {
            setIsLoading(true);
            const newSpent = new Array(members.length).fill(0);
            let newUsersShare = new Array(members.length).fill(0);
            groupExpense.forEach(
                ({
                    creditors_amounts,
                    debtors_adjustment,
                    debtors_weight,
                    amount,
                }) => {
                    for (const creditorId in creditors_amounts) {
                        newSpent[indexMap.get(Number(creditorId))] +=
                            creditors_amounts[creditorId];
                    }

                    let totalAdjustment = 0;
                    for (let debtorId in debtors_adjustment) {
                        if (debtors_adjustment.hasOwnProperty(debtorId)) {
                            totalAdjustment += debtors_adjustment[debtorId];
                        }
                    }
                    let totalWeight = 0;
                    for (let debtorId in debtors_weight) {
                        if (debtors_weight.hasOwnProperty(debtorId)) {
                            totalWeight += debtors_weight[debtorId];
                        }
                    }

                    for (let debtorId in debtors_weight) {
                        const debtorAdjustAmount = debtors_adjustment[debtorId]
                            ? debtors_adjustment[debtorId]
                            : 0;
                        newUsersShare[indexMap.get(Number(debtorId))] +=
                            ((amount - totalAdjustment) *
                                debtors_weight[debtorId]) /
                                totalWeight +
                            debtorAdjustAmount;
                    }
                }
            );
            //TODO:
            newUsersShare = newUsersShare.map((balance) =>
                Number(balance.toFixed(2))
            );
            setUsersShare(newUsersShare);
            setSpent(newSpent);
            setIsLoading(false);
        }
    }, [groupExpense, indexMap, members.length]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <GroupContext.Provider
            value={{
                slug,
                invitation_code,
                group,
                group_id,
                members,
                memberMap,
                indexMap,
                groupExpense,
                debts,
                expensesChanged,
                isPublicVisit,
                error,
                inviteEmail,
                balance,
                spent,
                usersShare,
                setMembers,
                setExpensesChanged,
                setInviteEmail,
            }}
        >
            {children}
        </GroupContext.Provider>
    );
};

export { GroupContext, GroupContextProvider };
