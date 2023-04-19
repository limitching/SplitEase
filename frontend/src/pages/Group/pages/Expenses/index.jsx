import { PageWrapper, ListWrapper } from "../../components/PageWrapper";
import Transaction from "./components/Transaction";
import ExpensesBlock from "./components/ExpensesBlock";
import ExpenseModificationModal from "./components/ExpenseModificationModal";

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
