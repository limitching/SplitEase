import Transaction from "./components/Transaction";
import ExpensesBlock from "./components/ExpensesBlock";
import ExpenseModificationModal from "./components/ExpenseModificationModal";
import { Container, Row, Col } from "react-bootstrap";

const Expenses = () => {
    return (
        <Container style={{ marginTop: "2rem" }}>
            <Row className="justify-content-md-center">
                <ExpensesBlock />
            </Row>
            <Row className="justify-content-md-center">
                <Col
                    lg="2"
                    className="justify-content-md-center"
                    style={{
                        display: "flex",
                        paddingTop: "3rem",
                        paddingBottom: "3rem",
                    }}
                >
                    <Transaction />
                    <ExpenseModificationModal />
                </Col>
            </Row>
        </Container>
    );
};

export default Expenses;
