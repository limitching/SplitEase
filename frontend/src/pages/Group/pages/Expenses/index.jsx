import { PageWrapper, ListWrapper } from "../../components/PageWrapper";
import Transaction from "./components/Transaction";
import ExpensesBlock from "./components/ExpensesBlock";
import ExpenseModificationModal from "./components/ExpenseModificationModal";
import { useContext } from "react";
import { ExpenseContext } from "../../../../contexts/ExpenseContext";
import Drawer from "@mui/material/Drawer";
import { splitMethodsIntro, currencyIntro } from "./components/Introduction";

const Expenses = () => {
    const {
        splitIntroOpen,
        setSplitIntroOpen,
        currencyIntroOpen,
        setCurrencyIntroOpen,
    } = useContext(ExpenseContext);
    return (
        <>
            <Drawer
                anchor={"right"}
                open={splitIntroOpen}
                onClose={() => setSplitIntroOpen(false)}
            >
                {splitMethodsIntro("right")}
            </Drawer>
            <Drawer
                anchor={"right"}
                open={currencyIntroOpen}
                onClose={() => setCurrencyIntroOpen(false)}
            >
                {currencyIntro("right")}
            </Drawer>
            <PageWrapper id="expense-block">
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
