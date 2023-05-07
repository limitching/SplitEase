import { createContext, useState, useEffect, useContext } from "react";
import { GroupContext } from "./GroupContext";

const timeZoneOffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
const localISOTime = new Date(Date.now() - timeZoneOffset)
    .toISOString()
    .substring(0, 16);

const ExpenseContext = createContext({
    checked: [],
    subCredit: [],
    subValues: [],
    amount: 0,
    selectedCurrency: 1,
    selectedCreditor: 0,
    selectedSplitMethod: 0,
    selectedExpense: { status: "unsettled" },
    expenseTime: localISOTime,
    description: "",
    showTransaction: false,
    showModification: false,
    splitIntroOpen: false,
    currencyIntroOpen: false,
    setChecked: () => {},
    setSubCredit: () => {},
    setSubValues: () => {},
    setAmount: () => {},
    setSelectedCurrency: () => {},
    setSelectedCreditor: () => {},
    setSelectedSplitMethod: () => {},
    setSelectedExpense: () => {},
    setExpenseTime: () => {},
    setDescription: () => {},
    setShowTransaction: () => {},
    setShowModification: () => {},
    setSplitIntroOpen: () => {},
    setCurrencyIntroOpen: () => {},
});

const ExpenseContextProvider = ({ children }) => {
    // States
    const { members } = useContext(GroupContext);
    const [checked, setChecked] = useState([]);
    const [subCredit, setSubCredit] = useState(Array(members.length).fill(0));
    const [subValues, setSubValues] = useState(Array(members.length).fill(0));
    const [amount, setAmount] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState(1);
    const [selectedCreditor, setSelectedCreditor] = useState(0);
    const [selectedSplitMethod, setSelectedSplitMethod] = useState(0);
    const [selectedExpense, setSelectedExpense] = useState({
        status: "unsettled",
    });
    const [expenseTime, setExpenseTime] = useState(localISOTime);
    const [description, setDescription] = useState("");
    const [showTransaction, setShowTransaction] = useState(false);
    const [showModification, setShowModification] = useState(false);

    const [splitIntroOpen, setSplitIntroOpen] = useState(false);
    const [currencyIntroOpen, setCurrencyIntroOpen] = useState(false);

    useEffect(() => {
        if (members !== null) {
            setChecked([...members]);
        }
        setSubValues(Array(members.length).fill(0));
    }, [members]);
    // if (members.length === 0) {
    //     return;
    // }

    return (
        <ExpenseContext.Provider
            value={{
                checked,
                subCredit,
                subValues,
                amount,
                selectedCurrency,
                selectedCreditor,
                selectedSplitMethod,
                selectedExpense,
                expenseTime,
                description,
                showTransaction,
                showModification,
                splitIntroOpen,
                currencyIntroOpen,
                setChecked,
                setSubCredit,
                setSubValues,
                setAmount,
                setSelectedCurrency,
                setSelectedCreditor,
                setSelectedSplitMethod,
                setSelectedExpense,
                setExpenseTime,
                setDescription,
                setShowTransaction,
                setShowModification,
                setSplitIntroOpen,
                setCurrencyIntroOpen,
            }}
        >
            {children}
        </ExpenseContext.Provider>
    );
};

export { ExpenseContext, localISOTime, ExpenseContextProvider };
