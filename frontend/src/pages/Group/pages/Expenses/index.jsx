import { PageWrapper, ListWrapper } from "../../components/PageWrapper";
import Transaction from "./components/Transaction";
import ExpensesBlock from "./components/ExpensesBlock";
import ExpenseModificationModal from "./components/ExpenseModificationModal";
import ExpensePageGuide from "./components/ExpensePageGuide";

const Expenses = () => {
    return (
        <>
            <PageWrapper id="expense-block">
                <ListWrapper>
                    <ExpensesBlock />
                    <Transaction />
                    <ExpenseModificationModal />
                </ListWrapper>
                {/* <ExpensePageGuide></ExpensePageGuide> */}
            </PageWrapper>
        </>
    );
};

export default Expenses;
