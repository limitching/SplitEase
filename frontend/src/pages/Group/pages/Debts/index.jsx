import DebtsBlock from "./components/DebtsBlock";
import { Container, Row } from "react-bootstrap";

const Debts = () => {
    return (
        <Container style={{ marginTop: "2rem", marginBottom: "5rem" }}>
            <Row className="justify-content-md-center">
                <DebtsBlock></DebtsBlock>
            </Row>
        </Container>
    );
};

export default Debts;
