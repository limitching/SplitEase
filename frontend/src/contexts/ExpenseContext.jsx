import { createContext, useState } from "react";

const ExpenseContext = createContext({
    checked: [],
    setChecked: () => {},
});

const ExpenseContextProvider = ({ children }) => {
    const [checked, setChecked] = useState([]);

    return (
        <ExpenseContext.Provider
            value={{
                checked,
                setChecked,
            }}
        >
            {children}
        </ExpenseContext.Provider>
    );
};

export { ExpenseContext, ExpenseContextProvider };
