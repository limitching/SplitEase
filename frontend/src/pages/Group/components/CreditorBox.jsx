import { Container, Form, InputGroup, Row, Col } from "react-bootstrap";
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
            <Form className="creditor">
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
                            handleCurrencyOptionChange={
                                handleCurrencyOptionChange
                            }
                        />
                    </Col>
                </InputGroup>
            </Form>
        </Container>
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

export default Creditor;
