import { TextField, MenuItem } from "@mui/material";
import { CURRENCY_OPTIONS } from "../../../../../global/constant";
import { ExpenseContext } from "../../../../../contexts/ExpenseContext";
import { useContext } from "react";
const CurrencySelector = () => {
    const { selectedCurrency, setSelectedCurrency } =
        useContext(ExpenseContext);
    const handleCurrencyOptionChange = (event) => {
        setSelectedCurrency(event.target.value);
    };

    return (
        <TextField
            name="currency_option"
            select
            label="Currency"
            variant="standard"
            value={selectedCurrency}
            onChange={handleCurrencyOptionChange}
        >
            {CURRENCY_OPTIONS.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                    {option.abbreviation}
                </MenuItem>
            ))}
        </TextField>
    );
};
export default CurrencySelector;
