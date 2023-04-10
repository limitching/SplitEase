import { Container, Form, Col, Row, InputGroup } from "react-bootstrap";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { useContext } from "react";

const CurrencySelector = ({
    currencies,
    selectedCurrency,
    setSelectedCurrency,
}) => {
    const handleCurrencyOptionChange = (event) => {
        setSelectedCurrency(event.target.value);
    };

    return (
        <Form.Select
            name="currencyOption"
            defaultValue={selectedCurrency}
            onChange={handleCurrencyOptionChange}
        >
            {currencies.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.abbreviation}
                </option>
            ))}
        </Form.Select>
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
}) => {
    const { members, setMembers, gid } = useContext(GroupContext);
    if (members.length === 0) {
        return <div>Loading...</div>;
    }
    const handleAmountChange = (event) => {
        setAmount(event.target.value);
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
                    <Form.Control
                        name="amount"
                        className="mb-3"
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
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
