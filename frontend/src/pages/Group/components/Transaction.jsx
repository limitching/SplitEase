import { useState } from "react";
import {
    Container,
    Modal,
    Button,
    Form,
    Col,
    Row,
    InputGroup,
} from "react-bootstrap";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Checkbox,
    Avatar,
} from "@mui/material";
import { SPLIT_METHODS } from "../../../global/constant";

const TransactionSelector = () => {
    return (
        <Form.Select aria-label="Default select example">
            <option value="1">New Expense</option>
            <option value="2">New Income</option>
            <option value="3">New Settle up</option>
        </Form.Select>
    );
};

const CurrencySelector = ({ currencies, handleCurrencyOptionChange }) => {
    const handleCurrencyOptionChangeEvent = (event) => {
        handleCurrencyOptionChange(event.target.value);
    };

    return (
        <Form.Select onChange={handleCurrencyOptionChangeEvent}>
            {currencies.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.abbreviation}
                </option>
            ))}
        </Form.Select>
    );
};

const Creditor = ({
    members,
    currencies,
    handleCurrencyOptionChange,
    amount,
    handleAmountChange,
    handleSelectedCreditorChange,
}) => {
    if (members === null) {
        return <div>Loading...</div>;
    }
    const handleChangeAmountEvent = (event) => {
        handleAmountChange(event.target.value);
    };
    const handleChangeSelectedCreditorEvent = (event) => {
        handleSelectedCreditorChange(event.target.value);
    };

    return (
        <Container className="who-paid" as={Row}>
            <Form.Label>Who paid</Form.Label>
            <Col lg="6">
                <Form.Select
                    className="mb-3"
                    aria-label="Default select example"
                    onChange={handleChangeSelectedCreditorEvent}
                >
                    {members.map((member, index) => (
                        <option key={member.id} value={index}>
                            {member.name}
                        </option>
                    ))}
                    <option key="multi" value="multi">
                        Multiple Payer
                    </option>
                </Form.Select>
            </Col>
            <InputGroup as={Row}>
                <Col lg="8">
                    <Form.Control
                        name="amount"
                        className="mb-3"
                        type="number"
                        value={amount}
                        onChange={handleChangeAmountEvent}
                    />
                </Col>
                <Col lg="4">
                    {" "}
                    <CurrencySelector
                        currencies={currencies}
                        handleCurrencyOptionChange={handleCurrencyOptionChange}
                    />
                </Col>
            </InputGroup>
        </Container>
    );
};

const SplitMethodSelector = ({ handleSplitMethodChange }) => {
    const handleChangeSplitMethodEvent = (event) => {
        handleSplitMethodChange(event.target.value);
        console.log(event.target.value);
    };
    return (
        <Form.Select onChange={handleChangeSplitMethodEvent}>
            {SPLIT_METHODS.map((method, index) => (
                <option key={index} value={index}>
                    {method}
                </option>
            ))}
        </Form.Select>
    );
};

const DebtorList = ({
    members,
    currencies,
    selectedCurrency,
    amount,
    handleSplitMethodChange,
    checked,
    setChecked,
}) => {
    const [selectedCurrencyObj] = currencies.filter((currency) => {
        return currency.id === Number(selectedCurrency);
    });

    const handleToggle = (member) => () => {
        const currentIndex = checked.indexOf(member);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(member);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    // A function to update amount
    const updateDividedAmounts = (member) => {
        const currentIndex = checked.indexOf(member);
        if (currentIndex === -1) {
            return 0;
        } else {
            return parseFloat(Number(amount / checked.length).toFixed(2));
        }
    };

    return (
        <div className="debtor-list">
            <Container as={Row} className="debtor-header-container">
                <Form.Label column lg="6">
                    For whom
                </Form.Label>
                <Col lg="6">
                    <SplitMethodSelector
                        handleSplitMethodChange={handleSplitMethodChange}
                    />
                </Col>
            </Container>
            <Container className="debtor-list-container">
                <List
                    dense
                    sx={{
                        width: "100%",
                        maxWidth: 360,
                        bgcolor: "background.paper",
                    }}
                >
                    {members.map((member) => {
                        const labelId = `checkbox-list-secondary-label-${member.id}`;
                        return (
                            <ListItem
                                alignItems="center"
                                key={member.id}
                                secondaryAction={
                                    <Checkbox
                                        edge="end"
                                        onChange={handleToggle(member)}
                                        checked={checked.indexOf(member) !== -1}
                                        inputProps={{
                                            "aria-labelledby": labelId,
                                        }}
                                    />
                                }
                                disablePadding
                            >
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={`${member.name}`}
                                            src={`${member.image}.jpg`}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        id={labelId}
                                        primary={`${member.name}`}
                                        secondary={`${
                                            selectedCurrencyObj.symbol
                                        } ${updateDividedAmounts(member)}`}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Container>
        </div>
    );
};

const Transaction = ({ members, currencies, checked, setChecked }) => {
    const [show, setShow] = useState(false);

    const [selectedCurrency, setSelectedCurrency] = useState(1);
    const [amount, setAmount] = useState(0);
    const [selectedCreditor, setSelectedCreditor] = useState(0);
    const [selectedSplitMethod, setSelectedSplitMethod] = useState(0);

    const handleClose = () => setShow(false);
    // When Transaction window is opened, set amount = 0
    const handleShow = () => {
        setAmount(0);
        setShow(true);
    };
    // Select NT$ on default

    const handleCurrencyOptionChange = (selectedCurrency) => {
        setSelectedCurrency(selectedCurrency);
    };
    // When credit amount change, update state

    const handleAmountChange = (amountValue) => {
        setAmount(amountValue);
    };

    const handleSelectedCreditorChange = (selectedCreditor) => {
        setSelectedCreditor(selectedCreditor);
    };

    const handleSplitMethodChange = (selectedSplitMethod) => {
        setSelectedSplitMethod(selectedSplitMethod);
    };

    const handleExpenseSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        formData.append("split_method", selectedSplitMethod);
        formData.append("attached_group_id", "backendawesome");
        formData.append("creditors", members[selectedCreditor]);
        formData.append("debtors", checked);

        for (const pair of formData.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
        }
    };

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
                <Form onSubmit={handleExpenseSubmit}>
                    <Modal.Header closeButton as={Row}>
                        <Container className="transaction-method ml-0 pl-0">
                            <Col lg="6">
                                <TransactionSelector />
                            </Col>
                        </Container>
                    </Modal.Header>
                    <Modal.Body>
                        <Creditor
                            members={members}
                            currencies={currencies}
                            handleCurrencyOptionChange={
                                handleCurrencyOptionChange
                            }
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
                            checked={checked}
                            setChecked={setChecked}
                        ></DebtorList>

                        <Container className="expense-description mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                rows={3}
                            />
                        </Container>
                        <Container className="expense-image mb-3">
                            <Form.Label>Expense image</Form.Label>
                            <Form.Control type="file" />
                        </Container>
                        <Container className="expense-datetime mb-3">
                            <Form.Label>Date & time</Form.Label>
                            <Form.Control type="datetime-local" name="date" />
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Container className="d-grid">
                            <Button variant="warning" type="submit">
                                Save
                            </Button>
                        </Container>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};
export default Transaction;
