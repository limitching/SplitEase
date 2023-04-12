import { Container, Form, Col, Row, InputGroup } from "react-bootstrap";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { useContext } from "react";
import { TextField, MenuItem } from "@mui/material";
import { amountFormatter } from "../../../../../utils/formatter";

const CurrencySelector = ({
    currencies,
    selectedCurrency,
    setSelectedCurrency,
}) => {
    const handleCurrencyOptionChange = (event) => {
        setSelectedCurrency(event.target.value);
    };

    return (
        <TextField
            name="currencyOption"
            select
            label="Currency"
            // SelectProps={{
            //     native: true,
            // }}
            variant="standard"
            defaultValue={selectedCurrency}
            onChange={handleCurrencyOptionChange}
        >
            {currencies.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                    {option.abbreviation}
                </MenuItem>
            ))}
        </TextField>
    );
};

const CreditorsBlock = ({
    currencies,
    selectedCurrency,
    setSelectedCurrency,
    setSelectedCreditor,
    selectedCreditor,
    amount,
    setAmount,
    subValues,
    setSubValues,
    selectedSplitMethod,
}) => {
    const { members } = useContext(GroupContext);
    if (members.length === 0) {
        return <div>Loading...</div>;
    }
    const handleAmountChange = (event) => {
        setAmount(event.target.value);
        if (selectedSplitMethod === 1) {
            setSubValues(
                Array(members.length).fill(event.target.value / members.length)
            );
        }
    };

    const handleChangeSelectedCreditor = (event) => {
        setSelectedCreditor(event.target.value);
    };

    return (
        <Container className="who-paid" as={Row}>
            <Form.Label>Who paid</Form.Label>
            <Col lg="6">
                <Form.Select
                    className="mb-3"
                    aria-label="Default select example"
                    defaultValue={selectedCreditor}
                    onChange={handleChangeSelectedCreditor}
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
            </Col>
            <InputGroup as={Row}>
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
                    />
                </Col>
                <Col lg="4">
                    <CurrencySelector
                        currencies={currencies}
                        selectedCurrency={selectedCurrency}
                        setSelectedCurrency={setSelectedCurrency}
                    />
                </Col>
            </InputGroup>
        </Container>
    );
};

export default CreditorsBlock;
