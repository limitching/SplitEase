import DebtsBlock from "./components/DebtsBlock";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../../utils/api";
import { Container, Row } from "react-bootstrap";

async function fetchMembers(gid, setMembers) {
    try {
        const data = await api.getMembers(gid);
        setMembers(data);
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

    // States
    const [members, setMembers] = useState([]);
    // const [currencies, setCurrencies] = useState([]);

    const [expensesChanged, setExpensesChanged] = useState(false);
    const [debts, setDebts] = useState([]);

    useEffect(() => {
        fetchMembers(gid, setMembers);
        fetchGroupDebts(gid, setDebts);
    }, []);

    useEffect(() => {
        fetchGroupDebts(gid, setDebts);
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
