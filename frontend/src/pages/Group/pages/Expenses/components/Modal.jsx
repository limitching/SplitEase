import { Container, Form } from "react-bootstrap";
import CreditorsBlock from "./CreditorsBlock";
import DebtorsBlock from "./DebtorsBlock";
import { ExpenseContext } from "../../../../../contexts/ExpenseContext";
import styled from "styled-components";
import { useContext, useState } from "react";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

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

    const [error, setError] = useState(undefined);
    return (
        <Container className="expense-description mb-3">
            <Form.Label>Description</Form.Label>
            {/* <Form.Control
                as="textarea"
                // name="description"
                rows={3}
                defaultValue={
                    selectedExpense ? selectedExpense.description : ""
                }
            /> */}
            <TextField
                name="description"
                fullWidth
                multiline
                defaultValue={
                    selectedExpense ? selectedExpense.description : ""
                }
                onChange={(event) => {
                    event.target.value.length <= 50
                        ? setError(undefined)
                        : setError(
                              "Expense description cannot exceed 50 characters"
                          );
                }}
                placeholder="Description of this expense"
                error={Boolean(error)}
                helperText={error}
            ></TextField>
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

const ExpenseDatetime = ({ hasError, setHasError }) => {
    const { expenseTime, setExpenseTime } = useContext(ExpenseContext);

    const validateExpenseTime = (date) => {
        const now = dayjs();
        if (date.isAfter(now)) {
            setHasError(true);
        } else {
            setHasError(false);
        }
    };

    const handleExpenseTimeChange = (value) => {
        // console.log(value.target.value);
        // console.log(value.format("YYYY-MM-DDTHH:mm"));
        // setExpenseTime(value.target.value);
        const date = dayjs(value);
        validateExpenseTime(date);
        setExpenseTime(value.format("YYYY-MM-DDTHH:mm"));
    };

    return (
        <Container className="expense-datetime mb-3">
            <Form.Label>Date &amp; time</Form.Label>
            {/* <Form.Control
                type="datetime-local"
                name="date"
                value={expenseTime}
                onChange={handleExpenseTimeChange}
            /> */}
            <br></br>
            <DateTimePicker
                // name="date"
                value={dayjs(expenseTime)}
                // label="Select date"
                onChange={(value) => handleExpenseTimeChange(value)}
                disableFuture
                error={hasError}
                sx={{ width: "100%" }}
            />
            {hasError && (
                <Typography variant="body2" color="error">
                    Invalid date format (Date cannot be future)
                </Typography>
            )}
        </Container>
    );
};

const ModalContent = ({ hasError, setHasError }) => {
    const { selectedCreditor } = useContext(ExpenseContext);

    if (selectedCreditor !== "multi") {
        return (
            <>
                <CreditorsBlock />
                <DebtorsBlock />
                <ExpenseDescription />
                {/* <ExpenseImage /> */}
                <ExpenseDatetime
                    hasError={hasError}
                    setHasError={setHasError}
                />
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
                {/* <ExpenseImage /> */}
                <ExpenseDatetime
                    hasError={hasError}
                    setHasError={setHasError}
                />
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
