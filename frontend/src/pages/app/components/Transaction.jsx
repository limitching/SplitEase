import React, { useState } from "react";
import { Container, Modal, Button, Form, Col, Row } from "react-bootstrap";
import DebtorList from "./DebtorList";
import Creditor from "./CreditorBox";

const TransactionCategory = () => {
    return (
        <Form.Select aria-label="Default select example">
            <option value="1">New Expense</option>
            <option value="2">New Income</option>
            <option value="3">New Settle up</option>
        </Form.Select>
    );
};

const Transaction = ({ members, currencies }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    // When Transaction window is opened, set amount = 0
    const handleShow = () => {
        setAmount(0);
        setShow(true);
    };
    // Select NT$ on default
    const [selectedCurrency, setSelectedCurrency] = useState(1);
    const handleCurrencyOptionChange = (selectedCurrency) => {
        setSelectedCurrency(selectedCurrency);
    };
    // When credit amount change, update state
    const [amount, setAmount] = useState(0);
    const handleAmountChange = (amountValue) => {
        setAmount(amountValue);
    };
    const [selectedCreditor, setSelectedCreditor] = useState(0);
    const handleSelectedCreditorChange = (selectedCreditor) => {
        setSelectedCreditor(selectedCreditor);
    };
    const [selectedSplitMethod, setSelectedSplitMethod] = useState(0);
    const handleSplitMethodChange = (selectedSplitMethod) => {
        setSelectedSplitMethod(selectedSplitMethod);
    };

    const submitExpense = () => {};

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add Transaction
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton as={Row}>
                    <Container className="transaction-method ml-0 pl-0">
                        <Col lg="6">
                            <TransactionCategory />
                        </Col>
                    </Container>
                </Modal.Header>
                <Modal.Body>
                    <Creditor
                        members={members}
                        currencies={currencies}
                        handleCurrencyOptionChange={handleCurrencyOptionChange}
                        amount={amount}
                        handleAmountChange={handleAmountChange}
                        handleSelectedCreditorChange={
                            handleSelectedCreditorChange
                        }
                    />

                    <hr />

                    <DebtorList
                        members={members}
                        currencies={currencies}
                        selectedCurrency={selectedCurrency}
                        amount={amount}
                        handleSplitMethodChange={handleSplitMethodChange}
                    ></DebtorList>

                    <Container className="expense-description mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} />
                    </Container>
                    <Container className="expense-image mb-3">
                        <Form.Label>Expense image</Form.Label>
                        <Form.Control type="file" />
                    </Container>
                    <Container className="expense-datetime mb-3">
                        <Form.Label>Date & time</Form.Label>
                        <Form.Control type="datetime-local" />
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Container className="d-grid">
                        <Button variant="warning" onClick={submitExpense}>
                            Save
                        </Button>
                    </Container>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default Transaction;
