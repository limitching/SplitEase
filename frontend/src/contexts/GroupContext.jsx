import {
    createContext,
    useState,
    useEffect,
    useContext,
    useMemo,
    useRef,
    useCallback,
} from "react";
import { useParams, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { api } from "../utils/api";
import Loading from "../components/Preloader/Preloader";
import { API_HOST } from "../global/constant";
import io from "socket.io-client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

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
    settlingDebts: [],
    expensesChanged: false,
    isPublicVisit: false,
    error: null,
    inviteEmail: "",
    balance: [],
    spent: [],
    usersShare: [],
    logs: [],
    wrapperOutletRef: null,
    showFixedButton: true,
    socket: null,
    joinGroup: () => {},
    setMembers: () => {},
    setExpensesChanged: () => {},
    setInviteEmail: () => {},
    setInvitation_code: () => {},
    setShowFixedButton: () => {},
});

async function fetchMembers(group_id, setMembers) {
    try {
        const data = await api.getMembers(group_id);
        setMembers(data);
    } catch (error) {
        console.error(error);
    }
}

async function fetchGroupExpenses(group_id, setGroupExpense, jwtToken) {
    try {
        const data = await api.getGroupExpenses(group_id, jwtToken);
        setGroupExpense(data);
    } catch (error) {
        console.error(error);
    }
}

async function fetchGroupDebts(group_id, setDebts, jwtToken) {
    try {
        const data = await api.getGroupDebts(group_id, jwtToken);
        setDebts(data);
    } catch (error) {
        console.error(error);
    }
}

async function fetchSettlingGroupDebts(group_id, setSettlingDebts, jwtToken) {
    try {
        const data = await api.getSettlingGroupDebts(group_id, jwtToken);
        setSettlingDebts(data);
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
    // console.log("response", response);
    if (response.data.error) {
        return setError(response.data.error);
    }
    setGroup(response.data.group);
    setMembers(response.data.members);
    setIsPublicVisit(true);
}

async function fetchGroupLogs(jwtToken, group_id, setLogs) {
    try {
        const data = await api.getGroupLogs(jwtToken, group_id);
        setLogs(data);
    } catch (error) {
        console.error(error);
    }
}

const GroupContextProvider = ({ children }) => {
    const location = useLocation();
    const { userGroups, jwtToken, setGroupChange } = useContext(AuthContext);
    const { slug } = useParams();

    const [group_id, setGroup_id] = useState(null);
    const [members, setMembers] = useState([]);
    const [membersChange, setMembersChange] = useState(false);
    const [groupExpense, setGroupExpense] = useState([]);
    const [debts, setDebts] = useState([]);
    const [settlingDebts, setSettlingDebts] = useState([]);
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
    const [logs, setLogs] = useState([]);

    const wrapperOutletRef = useRef(null);
    const [showFixedButton, setShowFixedButton] = useState(true);

    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);

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

    useEffect(() => {
        if (jwtToken && slug) {
            const newSocket = io(API_HOST, { query: { slug } });
            socketRef.current = newSocket;
            setSocket(socketRef.current);
            newSocket.on("connection", () => {
                console.log("Connected to server(Client)");
            });

            newSocket.on("refreshMembers", () => {
                // console.log("got refreshMembers");
                setMembersChange(true);
            });

            newSocket.on("expenseChange", () => {
                console.log("expense Change~");
                setExpensesChanged(true);
            });

            newSocket.on("logsChange", () => {
                if (group?.id) {
                    // console.log("expense Change~");
                    fetchGroupLogs(jwtToken, group.id, setLogs);
                }
            });

            return () => {
                newSocket.disconnect();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, jwtToken]);

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
            fetchGroupDebts(group_id, setDebts, jwtToken);
            fetchSettlingGroupDebts(group_id, setSettlingDebts, jwtToken);
            fetchGroupExpenses(group_id, setGroupExpense, jwtToken);
            fetchGroupLogs(jwtToken, group_id, setLogs);
            setIsLoading(false);
        }
    }, [group_id, jwtToken]);

    useEffect(() => {
        const fetchData = async () => {
            if (expensesChanged) {
                fetchGroupDebts(group_id, setDebts, jwtToken);
                fetchGroupLogs(jwtToken, group_id, setLogs);
                await fetchSettlingGroupDebts(
                    group_id,
                    setSettlingDebts,
                    jwtToken
                );
                fetchGroupExpenses(group_id, setGroupExpense, jwtToken);
                setExpensesChanged(false);
            }
        };
        fetchData();
    }, [expensesChanged, group_id, jwtToken]);
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

    const handleJoinGroup = useCallback(
        async (slug, invitation_code, jwtToken) => {
            const response = await api.joinGroup(
                slug,
                invitation_code,
                jwtToken
            );
            if (response.status === 200) {
                MySwal.fire({
                    title: <p>Join Successfully!</p>,
                    icon: "success",
                    timer: 1000,
                    didOpen: () => {
                        MySwal.showLoading();
                    },
                });
                setGroupChange(true);
                return;
            } else if (response.status === 400) {
                const { error } = response.data;
                MySwal.fire({
                    title: <p>Client Side Error</p>,
                    html: <p>{error}</p>,
                    icon: "error",
                    timer: 2000,
                    didOpen: () => {
                        MySwal.showLoading();
                    },
                });
            } else if (response.status === 500) {
                const { error } = response.data;
                MySwal.fire({
                    title: <p>Server Side Error</p>,
                    html: <p>{error}</p>,
                    icon: "error",
                    timer: 2000,
                    didOpen: () => {
                        MySwal.showLoading();
                    },
                });
            }
        },
        [setGroupChange]
    );

    useEffect(() => {
        if (membersChange === true && group_id) {
            fetchMembers(group_id, setMembers);
            fetchGroupLogs(jwtToken, group_id, setLogs);
            setMembersChange(false);
        }
    }, [membersChange, group_id, jwtToken]);

    const joinGroup = async (slug, invitation_code, jwtToken) => {
        setIsLoading(true);
        handleJoinGroup(slug, invitation_code, jwtToken);
        setIsLoading(false);
        socket.emit("refreshMembers");
        // return navigate("home");
    };

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
                settlingDebts,
                expensesChanged,
                isPublicVisit,
                error,
                inviteEmail,
                balance,
                spent,
                usersShare,
                logs,
                wrapperOutletRef,
                showFixedButton,
                socket,
                joinGroup,
                setMembers,
                setExpensesChanged,
                setInviteEmail,
                setInvitation_code,
                setShowFixedButton,
            }}
        >
            {children}
        </GroupContext.Provider>
    );
};

export { GroupContext, GroupContextProvider };
