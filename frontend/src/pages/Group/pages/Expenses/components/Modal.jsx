import { Container, Form } from "react-bootstrap";
import CreditorsBlock from "./CreditorsBlock";
import DebtorsBlock from "./DebtorsBlock";
import { ExpenseContext } from "../../../../../contexts/ExpenseContext";
import styled from "styled-components";
import { useContext } from "react";

const StyledExpenseImage = styled.img`
    width: 400px;
    hight: auto;
    padding-top: 1rem;
    padding-bottom: 1rem;
    overflow: scroll;
`;

const TransactionSelector = () => {
    return (
        <Form.Select aria-label="Default select example">
            <option value="1">New Expense</option>
            <option value="2">New Income</option>
            <option value="3">New Settle up</option>
        </Form.Select>
    );
};

const ExpenseDescription = () => {
    const { selectedExpense } = useContext(ExpenseContext);
    return (
        <Container className="expense-description mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
                as="textarea"
                name="description"
                rows={3}
                defaultValue={
                    selectedExpense ? selectedExpense.description : ""
                }
            />
        </Container>
    );
};

const ExpenseImage = () => {
    const { selectedExpense } = useContext(ExpenseContext);
    return (
        <Container className="expense-image mb-3">
            <Form.Label>Receipt photo</Form.Label>
            {selectedExpense && selectedExpense.image ? (
                <Container>
                    <StyledExpenseImage
                        src={`http://localhost:3000/assets/${selectedExpense.image}`}
                        alt="Ops, your network is unstable, so this image cannot load."
                    ></StyledExpenseImage>
                </Container>
            ) : null}
            <Form.Control type="file" name="image" />
        </Container>
    );
};

const ExpenseDatetime = () => {
    const { expenseTime, setExpenseTime } = useContext(ExpenseContext);
    const handleExpenseTimeChange = (event) => {
        setExpenseTime(event.target.value);
    };
    return (
        <Container className="expense-datetime mb-3">
            <Form.Label>Date &amp; time</Form.Label>
            <Form.Control
                type="datetime-local"
                name="date"
                defaultValue={expenseTime}
                onChange={handleExpenseTimeChange}
            />
        </Container>
    );
};

const ModalContent = () => {
    const { selectedCreditor } = useContext(ExpenseContext);
    if (selectedCreditor !== "multi") {
        return (
            <>
                <CreditorsBlock />
                <DebtorsBlock />
                <ExpenseDescription />
                <ExpenseImage />
                <ExpenseDatetime />
            </>
        );
    } else {
        return (
            <>
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <CreditorsBlock />
                    <DebtorsBlock />
                </div>
                <ExpenseDescription />
                <ExpenseImage />
                <ExpenseDatetime />
            </>
        );
    }
};
export {
    TransactionSelector,
    ExpenseDescription,
    ExpenseImage,
    ExpenseDatetime,
    ModalContent,
};
