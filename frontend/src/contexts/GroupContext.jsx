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

    if (isLoading) {
        return <Loading />;
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
