import { Container, Form, Col, Row } from "react-bootstrap";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { ExpenseContext } from "../../../../../contexts/ExpenseContext";
import {
    CURRENCY_OPTIONS,
    ANIMAL_AVATAR,
} from "../../../../../global/constant";
import CurrencySelector from "./CurrencySelector";
import { useContext } from "react";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    TextField,
} from "@mui/material";
import { amountFormatter } from "../../../../../utils/formatter";

const CreditorsBlock = () => {
    const { members } = useContext(GroupContext);
    const {
        subCredit,
        selectedCurrency,
        selectedSplitMethod,
        selectedCreditor,
        amount,
        setSubValues,
        setSubCredit,
        setSelectedCreditor,
        setAmount,
    } = useContext(ExpenseContext);
    if (members.length === 0) {
        return <div>Loading...</div>;
    }
    const [selectedCurrencyObj] = CURRENCY_OPTIONS.filter((currency) => {
        return currency.id === Number(selectedCurrency);
    });
    const handleAmountChange = (event) => {
        setAmount(Number(event.target.value));
        if (selectedSplitMethod === 1) {
            setSubValues(
                Array(members.length).fill(event.target.value / members.length)
            );
        }
    };

    const handleChangeSelectedCreditor = (event) => {
        setSelectedCreditor(event.target.value);
    };

    const handleSubCreditChange = (index, newCredit) => {
        const newSubCredit = [...subCredit];
        newSubCredit[index] = newCredit;
        setSubCredit(newSubCredit);
        const newAmount = newSubCredit.reduce((sum, value) => sum + value, 0);
        setAmount(newAmount);
        if (selectedSplitMethod === 1) {
            setSubValues(
                Array(members.length).fill(newAmount / members.length)
            );
        }
    };

    if (selectedCreditor !== "multi") {
        return (
            <div className="creditor-block" style={{ width: "100%" }}>
                <Container className="creditor-header-container" as={Row}>
                    <Form.Label column lg="6">
                        Who paid
                    </Form.Label>
                </Container>
                <Container className="creditor-selector">
                    <Form.Select
                        className="mb-3"
                        value={selectedCreditor}
                        onChange={(event) =>
                            handleChangeSelectedCreditor(event)
                        }
                    >
                        {members.map((member) => (
                            <option key={member.id} value={member.id}>
                                {member.name}
                            </option>
                        ))}
                        <option key="multi" value="multi">
                            Multiple Payer
                        </option>
                    </Form.Select>
                </Container>
                <Container className="creditor-total-amount" as={Row}>
                    <Col lg="8">
                        <TextField
                            name="amount"
                            className="mb-3"
                            label="Amount"
                            type="text"
                            value={amount}
                            onChange={(event) => {
                                amountFormatter(event);
                                handleAmountChange(event);
                            }}
                            fullWidth
                        />
                    </Col>
                    <Col
                        lg="4"
                        style={{
                            display: "flex",
                            justifyContent: "end",
                            padding: 0,
                        }}
                    >
                        <CurrencySelector />
                    </Col>
                </Container>
            </div>
        );
    } else {
        return (
            <div className="creditor-block" style={{ width: "100%" }}>
                <Container className="creditor-header-container" as={Row}>
                    <TextField
                        name="amount"
                        className="mb-3"
                        label="Amount (Read only)"
                        type="text"
                        helperText="Amount will automatically update when edit sub-amounts."
                        value={amount}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                    />
                </Container>
                <Container className="creditor-total-amount" as={Row}>
                    <Col lg="8">
                        {" "}
                        <Form.Label column lg="6">
                            Who paid
                        </Form.Label>
                    </Col>
                    <Col
                        lg="4"
                        style={{
                            display: "flex",
                            justifyContent: "end",
                            padding: 0,
                        }}
                    >
                        <CurrencySelector />
                    </Col>
                </Container>
                <Container className="creditor-list-container" as={Row}>
                    <List
                        dense
                        sx={{
                            width: "100%",
                            maxWidth: 500,
                            bgcolor: "background.paper",
                        }}
                    >
                        {members.map((member, index) => {
                            const labelId = `checkbox-list-secondary-label-${member.id}`;
                            return (
                                <ListItem
                                    alignItems="center"
                                    key={member.id}
                                    disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={`${member.name}`}
                                                src={`${
                                                    member.image
                                                        ? member.image
                                                        : ANIMAL_AVATAR[index]
                                                }`}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            id={labelId}
                                            primary={`${member.name}`}
                                        />
                                        <TextField
                                            type="text"
                                            variant="standard"
                                            value={Number(
                                                subCredit[index].toFixed(2)
                                            )}
                                            inputProps={{
                                                style: {
                                                    textAlign: "right",
                                                },
                                            }}
                                            onChange={(event) => {
                                                amountFormatter(event);
                                                handleSubCreditChange(
                                                    index,
                                                    Number(event.target.value)
                                                );
                                            }}
                                            sx={{ width: "30%" }}
                                        />
                                        <ListItemText
                                            primary={` ${selectedCurrencyObj.abbreviation}`}
                                            style={{ maxWidth: "2rem" }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Container>
            </div>
        );
    }
};

export default CreditorsBlock;
