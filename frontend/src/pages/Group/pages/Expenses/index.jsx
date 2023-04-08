import Transaction from "./components/Transaction";
import ExpensesBlock from "./components/ExpensesBlock";
import ExpenseModificationModal from "./components/ExpenseModificationModal";

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

const Expenses = () => {
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

    useEffect(() => {
        fetchMembers(gid, setMembers);
        // fetchCurrencies(setCurrencies);
        fetchGroupExpenses(gid, setGroupExpense);
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
        <Container style={{ marginTop: "5rem" }}>
            <Row className="justify-content-md-center">
                <ExpensesBlock
                    groupExpense={groupExpense}
                    members={members}
                    memberMap={memberMap}
                    setSelectedExpense={setSelectedExpense}
                    setShowModification={setShowModification}
                    setAmount={setAmount}
                    setSelectedCreditor={setSelectedCreditor}
                    setChecked={setChecked}
                    setSelectedCurrency={setSelectedCurrency}
                    setSelectedSplitMethod={setSelectedSplitMethod}
                    setExpenseTime={setExpenseTime}
                    setDescription={setDescription}
                ></ExpensesBlock>
            </Row>
            <Row className="justify-content-md-center">
                <Col
                    lg="2"
                    className="justify-content-md-center"
                    style={{
                        display: "flex",
                        paddingTop: "3rem",
                        paddingBottom: "3rem",
                    }}
                >
                    <Transaction
                        gid={gid}
                        showTransaction={showTransaction}
                        setShowTransaction={setShowTransaction}
                        members={members}
                        memberMap={memberMap}
                        currencies={currencies}
                        selectedCreditor={selectedCreditor}
                        setSelectedCreditor={setSelectedCreditor}
                        checked={checked}
                        setChecked={setChecked}
                        localISOTime={localISOTime}
                        expenseTime={expenseTime}
                        setExpenseTime={setExpenseTime}
                        setExpensesChanged={setExpensesChanged}
                        selectedExpense={selectedExpense}
                        amount={amount}
                        setAmount={setAmount}
                        selectedCurrency={selectedCurrency}
                        setSelectedCurrency={setSelectedCurrency}
                        selectedSplitMethod={selectedSplitMethod}
                        setSelectedSplitMethod={setSelectedSplitMethod}
                    />
                    <ExpenseModificationModal
                        gid={gid}
                        showModification={showModification}
                        setShowModification={setShowModification}
                        members={members}
                        memberMap={memberMap}
                        currencies={currencies}
                        selectedCurrency={selectedCurrency}
                        setSelectedCurrency={setSelectedCurrency}
                        selectedSplitMethod={selectedSplitMethod}
                        setSelectedSplitMethod={setSelectedSplitMethod}
                        checked={checked}
                        setChecked={setChecked}
                        expenseTime={expenseTime}
                        setExpenseTime={setExpenseTime}
                        setExpensesChanged={setExpensesChanged}
                        selectedExpense={selectedExpense}
                        amount={amount}
                        setAmount={setAmount}
                        selectedCreditor={selectedCreditor}
                        setSelectedCreditor={setSelectedCreditor}
                        description={description}
                        setDescription={setDescription}
                    ></ExpenseModificationModal>
                </Col>
            </Row>
        </Container>
    );
};

export default Expenses;
