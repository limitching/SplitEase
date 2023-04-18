import {
    PageWrapper,
    ListWrapper,
    HeaderTextContainer,
} from "../../components/PageWrapper";
import Transaction from "./components/Transaction";
import ExpensesBlock from "./components/ExpensesBlock";
import ExpenseModificationModal from "./components/ExpenseModificationModal";
import { Container, Row, Col } from "react-bootstrap";

const Expenses = () => {
    return (
        <>
            <PageWrapper>
                <ListWrapper>
                    <ExpensesBlock />
                    <Transaction />
                    <ExpenseModificationModal />
                </ListWrapper>
            </PageWrapper>
        </>
    );
};

export default Expenses;
