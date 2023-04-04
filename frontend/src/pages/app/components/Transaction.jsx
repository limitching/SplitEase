import React, { useState, useEffect, useRef } from "react";
import { api } from "../../../utils/api";
import { Container, Modal, Button, Form, InputGroup } from "react-bootstrap";
import DebtorList from "./DebtorList";

const TransactionCategory = () => {
    return (
        <Form.Select aria-label="Default select example">
            <option value="1">New Expense</option>
            <option value="2">New Income</option>
            <option value="3">New Settle up</option>
        </Form.Select>
    );
};
const Creditor = ({ members, currencies, handleCurrencyOptionChange }) => {
    if (members === null) {
        return <div>Loading...</div>;
    }
    return (
        <Container className="who-paid">
            <p>Who paid</p>
            <Form.Select aria-label="Default select example">
                {members.map((member) => (
                    <option key={member.id} value={member.id}>
                        {member.name}
                    </option>
                ))}
                <option key="multi" value="multi">
                    Multiple Payer
                </option>
            </Form.Select>
            <InputGroup>
                <input type="text" />
                <CurrencySelection
                    currencies={currencies}
                    handleCurrencyOptionChange={handleCurrencyOptionChange}
                />
            </InputGroup>
        </Container>
    );
};

const CurrencySelection = ({ currencies, handleCurrencyOptionChange }) => {
    const handleChange = (event) => {
        handleCurrencyOptionChange(event.target.value);
    };

    return (
        <Form.Select
            aria-label="Default select example"
            onChange={handleChange}
        >
            {currencies.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.abbreviation}
                </option>
            ))}
        </Form.Select>
    );
};

const Transaction = ({ members, currencies }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [selectedCurrency, setSelectedCurrency] = useState(1);
    const handleCurrencyOptionChange = (selectedValue) => {
        setSelectedCurrency(selectedValue);
    };

    const [amount, setAmount] = useState(0);

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
                <Modal.Header closeButton>
                    {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">
                            Action
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">
                            Another action
                        </NavDropdown.Item>
                        er
                        <NavDropdown.Item href="#action/3.3">
                            Something
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">
                            Separated link
                        </NavDropdown.Item>
                    </NavDropdown> */}
                    <Container className="transaction-method">
                        <TransactionCategory />
                    </Container>
                </Modal.Header>
                <Modal.Body>
                    <Creditor
                        members={members}
                        currencies={currencies}
                        handleCurrencyOptionChange={handleCurrencyOptionChange}
                    />

                    <hr />

                    <DebtorList
                        members={members}
                        currencies={currencies}
                        selectedCurrency={selectedCurrency}
                    ></DebtorList>

                    <Container className="description">
                        <p>Description</p>
                        <input type="text" />
                    </Container>
                    <Container className="debtor-list">
                        <p>Date & time</p>
                        <input type="datetime-local" />
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Container>
                        <Button variant="secondary" onClick={handleClose}>
                            Save
                        </Button>
                    </Container>

                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary">Understood</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default Transaction;
