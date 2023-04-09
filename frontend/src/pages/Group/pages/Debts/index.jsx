import DebtsBlock from "./components/DebtsBlock";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../../utils/api";
import { Container, Row, Col } from "react-bootstrap";
import { CURRENCY_OPTIONS } from "../../../../global/constant";

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

const Debts = () => {
    const { gid } = useParams();
    const timeZoneOffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = new Date(Date.now() - timeZoneOffset)
        .toISOString()
        .substring(0, 16);

    // States
    const [members, setMembers] = useState([]);
    const [groupExpense, setGroupExpense] = useState([]);
    const currencies = CURRENCY_OPTIONS;
    // const [currencies, setCurrencies] = useState([]);
    const [checked, setChecked] = useState([]);
    const [expenseTime, setExpenseTime] = useState(localISOTime);
    const [expensesChanged, setExpensesChanged] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showTransaction, setShowTransaction] = useState(false);
    const [showModification, setShowModification] = useState(false);
    const [amount, setAmount] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState(1);
    const [selectedCreditor, setSelectedCreditor] = useState(0);
    const [selectedSplitMethod, setSelectedSplitMethod] = useState(0);
    const [description, setDescription] = useState("");
    const [debts, setDebts] = useState([]);

    useEffect(() => {
        fetchMembers(gid, setMembers);
        fetchGroupExpenses(gid, setGroupExpense);
        fetchGroupDebts(gid, setDebts);
    }, []);

    useEffect(() => {
        if (members !== null) {
            setChecked([...members]);
        }
    }, [members]);

    useEffect(() => {
        fetchGroupExpenses(gid, setGroupExpense);
        setExpensesChanged(false);
    }, [expensesChanged]);

    const memberMap = new Map();
    members.forEach((member) => {
        memberMap.set(member.id, member);
    });

    return (
        <Container style={{ marginTop: "5rem", marginBottom: "5rem" }}>
            <Row className="justify-content-md-center">
                <DebtsBlock members={members} debts={debts}></DebtsBlock>
            </Row>
        </Container>
    );
};

export default Debts;
