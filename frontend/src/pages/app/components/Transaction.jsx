import React, { useState } from "react";
import {
    Alert,
    Container,
    Modal,
    Button,
    Form,
    InputGroup,
    NavDropdown,
} from "react-bootstrap";
import { Avatar } from "@mui/material";
import DebtorList from "./DebtorList";

const TransactionCategory = () => {
    return (
        <Form.Select aria-label="Default select example">
            <option value="1" selected>
                New Expense
            </option>
            <option value="2">New Income</option>
            <option value="3">New Settle up</option>
        </Form.Select>
    );
};
const UserSelection = () => {
    return (
        <Form.Select aria-label="Default select example">
            <option value="1" selected>
                Alice
            </option>
            <option value="2">Bob</option>
            <option value="3">Charlie</option>
            <option value="4">David</option>
            <option value="5">Ema</option>
            <option value="6">Fred</option>
            <option value="7">Gabe</option>
            <option value="8">Henry</option>
            <option value="9">Irene</option>
            <option value="10">Jason</option>
        </Form.Select>
    );
};

const currencies = [
    {
        value: "USD",
        label: "$",
    },
    {
        value: "EUR",
        label: "€",
    },
    {
        value: "BTC",
        label: "฿",
    },
    {
        value: "JPY",
        label: "¥",
    },
];

const CurrencySelection = () => {
    return (
        <Form.Select aria-label="Default select example">
            {currencies.map((option) => (
                <option value={option.value}>{option.label}</option>
            ))}
        </Form.Select>
    );
};

const Transaction = function Example() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                    <Container className="who-paid">
                        <p>Who paid</p>
                        <UserSelection />
                        <InputGroup>
                            <input type="text" />
                            <CurrencySelection />
                        </InputGroup>
                    </Container>
                    <hr />
                    <Container className="debtor-list">
                        <p>For whom</p>
                        <DebtorList></DebtorList>
                    </Container>
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
