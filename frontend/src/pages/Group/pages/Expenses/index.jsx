import Transaction from "./components/Transaction";
import ExpensesBlock from "./components/ExpensesBlock";
import ExpenseModificationModal from "./components/ExpenseModificationModal";
import { GroupContext } from "../../../../contexts/GroupContext";
import { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { CURRENCY_OPTIONS } from "../../../../global/constant";

const Expenses = () => {
    const { members } = useContext(GroupContext);

    const timeZoneOffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = new Date(Date.now() - timeZoneOffset)
        .toISOString()
        .substring(0, 16);

    // States

    const currencies = CURRENCY_OPTIONS;
    const [checked, setChecked] = useState([]);
    const [expenseTime, setExpenseTime] = useState(localISOTime);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showTransaction, setShowTransaction] = useState(false);
    const [showModification, setShowModification] = useState(false);
    const [amount, setAmount] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState(1);
    const [selectedCreditor, setSelectedCreditor] = useState(0);
    const [selectedSplitMethod, setSelectedSplitMethod] = useState(0);
    const [description, setDescription] = useState("");
    const [subValues, setSubValues] = useState(Array(members.length).fill(0));

    useEffect(() => {
        if (members !== null) {
            setChecked([...members]);
        }
    }, [members]);
    if (members.length === 0) {
        return;
    }

    return (
        <Container style={{ marginTop: "5rem" }}>
            <Row className="justify-content-md-center">
                <ExpensesBlock
                    setSelectedExpense={setSelectedExpense}
                    setShowModification={setShowModification}
                    setAmount={setAmount}
                    setSelectedCreditor={setSelectedCreditor}
                    setChecked={setChecked}
                    setSelectedCurrency={setSelectedCurrency}
                    setSelectedSplitMethod={setSelectedSplitMethod}
                    setExpenseTime={setExpenseTime}
                    setDescription={setDescription}
                    subValues={subValues}
                    setSubValues={setSubValues}
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
                        showTransaction={showTransaction}
                        setShowTransaction={setShowTransaction}
                        currencies={currencies}
                        selectedCreditor={selectedCreditor}
                        setSelectedCreditor={setSelectedCreditor}
                        checked={checked}
                        setChecked={setChecked}
                        localISOTime={localISOTime}
                        expenseTime={expenseTime}
                        setExpenseTime={setExpenseTime}
                        selectedExpense={selectedExpense}
                        amount={amount}
                        setAmount={setAmount}
                        selectedCurrency={selectedCurrency}
                        setSelectedCurrency={setSelectedCurrency}
                        selectedSplitMethod={selectedSplitMethod}
                        setSelectedSplitMethod={setSelectedSplitMethod}
                        subValues={subValues}
                        setSubValues={setSubValues}
                    />
                    <ExpenseModificationModal
                        showModification={showModification}
                        setShowModification={setShowModification}
                        currencies={currencies}
                        selectedCurrency={selectedCurrency}
                        setSelectedCurrency={setSelectedCurrency}
                        selectedSplitMethod={selectedSplitMethod}
                        setSelectedSplitMethod={setSelectedSplitMethod}
                        checked={checked}
                        setChecked={setChecked}
                        expenseTime={expenseTime}
                        setExpenseTime={setExpenseTime}
                        selectedExpense={selectedExpense}
                        amount={amount}
                        setAmount={setAmount}
                        selectedCreditor={selectedCreditor}
                        setSelectedCreditor={setSelectedCreditor}
                        description={description}
                        setDescription={setDescription}
                        subValues={subValues}
                        setSubValues={setSubValues}
                    ></ExpenseModificationModal>
                </Col>
            </Row>
        </Container>
    );
};

export default Expenses;
