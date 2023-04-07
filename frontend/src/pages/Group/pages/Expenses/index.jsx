import Transaction from "./components/Transaction";
import ExpensesBlock from "./components/ExpensesBlock";
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

const Expenses = () => {
    const { gid } = useParams();
    const timeZoneOffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = new Date(Date.now() - timeZoneOffset)
        .toISOString()
        .substring(0, 16);

    const [members, setMembers] = useState([]);
    const [groupExpense, setGroupExpense] = useState([]);
    const currencies = CURRENCY_OPTIONS;
    // const [currencies, setCurrencies] = useState([]);
    const [checked, setChecked] = useState([]);
    const [expenseTime, setExpenseTime] = useState(localISOTime);

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
    const memberMap = new Map();
    members.map((member) => {
        memberMap.set(member.id, member);
    });

    return (
        <Container style={{ marginTop: "5rem" }}>
            <Row className="justify-content-md-center">
                <ExpensesBlock
                    groupExpense={groupExpense}
                    members={members}
                    memberMap={memberMap}
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
                        members={members}
                        memberMap={memberMap}
                        currencies={currencies}
                        checked={checked}
                        setChecked={setChecked}
                        expenseTime={expenseTime}
                        setExpenseTime={setExpenseTime}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Expenses;
