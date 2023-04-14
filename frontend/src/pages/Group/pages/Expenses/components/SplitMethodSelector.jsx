import { useContext } from "react";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { ExpenseContext } from "../../../../../contexts/ExpenseContext";
import { TextField, MenuItem } from "@mui/material";
import { SPLIT_METHODS } from "../../../../../global/constant";

function gcd(a, b) {
    if (b === 0) {
        return a;
    } else {
        return gcd(b, a % b);
    }
}

function normalizeArray(arr) {
    const maxDivisor = arr.reduce((acc, cur) => gcd(acc, cur));
    return arr.map((val) => (val === 0 ? 1 : val / maxDivisor));
}

const SplitMethodSelector = () => {
    const { members } = useContext(GroupContext);
    const {
        amount,
        subValues,
        selectedSplitMethod,
        setSubValues,
        setSelectedSplitMethod,
    } = useContext(ExpenseContext);
    const handleSplitMethodChange = (event) => {
        const previousMethod = selectedSplitMethod;
        setSelectedSplitMethod(Number(event.target.value));
        console.log(event.target.value, typeof event.target.value);
        console.log(SPLIT_METHODS[event.target.value]);
        if (event.target.value === 1) {
            setSubValues(Array(members.length).fill(amount / members.length));
        } else if (event.target.value === 2) {
            setSubValues(Array(members.length).fill(100 / members.length));
        } else if (event.target.value === 3) {
            if (previousMethod === 4) {
                return setSubValues(Array(members.length).fill(1));
            } else {
                setSubValues(normalizeArray(subValues));
            }
        } else if (event.target.value === 4) {
            setSubValues(Array(members.length).fill(0));
        }
    };
    return (
        <TextField
            select
            variant="standard"
            onChange={handleSplitMethodChange}
            value={selectedSplitMethod}
        >
            {SPLIT_METHODS.map((method, index) => (
                <MenuItem key={index} value={index}>
                    {method}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default SplitMethodSelector;
