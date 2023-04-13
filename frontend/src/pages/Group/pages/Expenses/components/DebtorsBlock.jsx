import SplitMethodSelector from "./SplitMethodSelector";
import { Container, Form, Col, Row } from "react-bootstrap";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { useContext, useState } from "react";
import { TextField } from "@mui/material";
import { TbPlusMinus } from "react-icons/tb";
import {
    removeLeadingZeros,
    inputFormatter,
    amountFormatter,
} from "../../../../../utils/formatter";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Checkbox,
    Avatar,
} from "@mui/material";

const DebtorsBlock = ({
    currencies,
    selectedCurrency,
    amount,
    setAmount,
    setSelectedSplitMethod,
    checked,
    setChecked,
    selectedSplitMethod,
    subValues,
    setSubValues,
    selectedCreditor,
}) => {
    const { members } = useContext(GroupContext);
    const [modifiedIndices, setModifiedIndices] = useState([]);

    if (members.length === 0) {
        return <div>Loading...</div>;
    }
    const [selectedCurrencyObj] = currencies.filter((currency) => {
        return currency.id === Number(selectedCurrency);
    });

    const handleToggle = (member) => () => {
        const currentIndex = checked.indexOf(member);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(member);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    // A function to update divided amount
    const updateDividedAmounts = (member, index) => {
        if (selectedSplitMethod === 0) {
            const currentIndex = checked.indexOf(member);
            if (currentIndex === -1) {
                return 0;
            } else {
                return parseFloat(Number(amount / checked.length).toFixed(2));
            }
        } else if (selectedSplitMethod === 1) {
        } else if (selectedSplitMethod === 2) {
            return parseFloat(
                Number((amount / 100) * subValues[index]).toFixed(2)
            );
        } else if (selectedSplitMethod === 3) {
            const totalShares = subValues.reduce((acc, cur) => acc + cur, 0);
            return parseFloat(
                Number((amount / totalShares) * subValues[index]).toFixed(2)
            );
        } else if (selectedSplitMethod === 4) {
            const totalAdjustments = subValues.reduce(
                (acc, cur) => acc + cur,
                0
            );
            return parseFloat(
                Number(
                    (amount - totalAdjustments) / members.length +
                        subValues[index]
                ).toFixed(2)
            );
        }
    };

    const handleExactAmountChange = (index, newValue) => {
        if (selectedCreditor === "multi") {
            const maxAmount = amount;
            if (newValue > maxAmount) {
                newValue = maxAmount;
            } else if (newValue < 0) {
                newValue = 0;
            }
            const newModifiedIndices = [...modifiedIndices];
            if (!modifiedIndices.includes(index)) {
                newModifiedIndices.push(index);
                if (newModifiedIndices.length === members.length) {
                    newModifiedIndices.length = 0;
                    newModifiedIndices.push(index);
                    setModifiedIndices(newModifiedIndices);
                } else {
                    setModifiedIndices(newModifiedIndices);
                }
            }
            console.log(newModifiedIndices);
            if (modifiedIndices.length === members.length) {
                setModifiedIndices([index]);
            }
            const newSubValues = [...subValues];
            // Update the value of the current field
            newSubValues[index] = newValue;

            // Calculate the sum of the percentages currently set
            const currentTotal = newSubValues.reduce(
                (accumulator, currentValue, currentIndex) => {
                    if (newModifiedIndices.includes(currentIndex)) {
                        return accumulator + currentValue;
                    } else {
                        return accumulator;
                    }
                },
                0
            );

            if (currentTotal > maxAmount) {
                newSubValues.fill(0);
                newSubValues[index] = newValue;
                newSubValues[index + 1] = maxAmount - newValue;
                setModifiedIndices([index, index + 1]);
                return setSubValues(newSubValues);
            }

            // Calculates the percentage by which other fields should be split equally
            const remaining = maxAmount - currentTotal;
            const toDistribute =
                remaining / (newSubValues.length - newModifiedIndices.length);

            // Split other fields equally
            for (let i = 0; i < newSubValues.length; i++) {
                if (i === index || newModifiedIndices.includes(i)) {
                    continue;
                }

                newSubValues[i] = toDistribute;
            }
            // Update state
            setSubValues(newSubValues);
            return;
        }
        if (newValue < 0) {
            newValue = 0;
        }
        const newSubValues = [...subValues];
        newSubValues[index] = newValue;
        setSubValues(newSubValues);

        const newAmount = newSubValues.reduce((sum, value) => sum + value, 0);
        setAmount(newAmount);
    };

    const handlePercentageChange = (index, newValue) => {
        // The value entered cannot be greater than 100 or less than 0
        if (newValue > 100) {
            newValue = 100;
        } else if (newValue < 0) {
            newValue = 0;
        }

        const newModifiedIndices = [...modifiedIndices];
        if (!modifiedIndices.includes(index)) {
            newModifiedIndices.push(index);
            if (newModifiedIndices.length === members.length) {
                newModifiedIndices.length = 0;
                newModifiedIndices.push(index);
                setModifiedIndices(newModifiedIndices);
            } else {
                setModifiedIndices(newModifiedIndices);
            }
        }
        if (modifiedIndices.length === members.length) {
            setModifiedIndices([index]);
        }

        const newSubValues = [...subValues];

        // Update the value of the current field
        newSubValues[index] = newValue;

        // Calculate the sum of the percentages currently set
        const currentTotal = newSubValues.reduce(
            (accumulator, currentValue, currentIndex) => {
                if (newModifiedIndices.includes(currentIndex)) {
                    return accumulator + currentValue;
                } else {
                    return accumulator;
                }
            },
            0
        );
        if (currentTotal > 100) {
            newSubValues.fill(0);
            newSubValues[index] = newValue;
            newSubValues[index + 1] = 100 - newValue;
            setModifiedIndices([index, index + 1]);
            return setSubValues(newSubValues);
        }

        // Calculates the percentage by which other fields should be split equally
        const remaining = 100 - currentTotal;
        const toDistribute =
            remaining / (newSubValues.length - newModifiedIndices.length);

        // Split other fields equally
        for (let i = 0; i < newSubValues.length; i++) {
            if (i === index || newModifiedIndices.includes(i)) {
                continue;
            }

            newSubValues[i] = toDistribute;
        }

        // Complete missing percentages due to decimal point errors
        const totalAfter = newSubValues.reduce((acc, val) => acc + val, 0);
        const diff = 100 - totalAfter;
        if (diff !== 0) {
            const sign = diff > 0 ? 1 : -1;
            for (let i = 0; i < Math.abs(diff); i++) {
                for (let j = newSubValues.length - 1; j >= 0; j--) {
                    if (newSubValues[j] !== 0) {
                        newSubValues[j] += sign * 0.01;
                        break;
                    }
                }
            }
        }

        // Update state
        setSubValues(newSubValues);
    };

    const handleShareChange = (index, newValue) => {
        if (newValue < 0) {
            newValue = 0;
        }
        const newSubValues = [...subValues];
        newSubValues[index] = newValue;

        // Update state
        setSubValues(newSubValues);
    };

    const handleAdjustmentChange = (index, newValue) => {
        const newSubValues = [...subValues];
        newSubValues[index] = newValue;

        // Update state
        setSubValues(newSubValues);
    };
    return (
        <div className="debtor-list">
            <Container as={Row} className="debtor-header-container">
                <Form.Label column lg="6">
                    For whom
                </Form.Label>
                <Col lg="6">
                    <SplitMethodSelector
                        selectedSplitMethod={selectedSplitMethod}
                        setSelectedSplitMethod={setSelectedSplitMethod}
                        setSubValues={setSubValues}
                        subValues={subValues}
                    />
                </Col>
            </Container>
            <Container className="debtor-list-container">
                <List
                    dense
                    sx={{
                        width: "100%",
                        maxWidth: 500,
                        bgcolor: "background.paper",
                    }}
                >
                    {members.map((member, index) => {
                        const labelId = `checkbox-list-secondary-label-${member.id}`;
                        if (selectedSplitMethod === 0) {
                            return (
                                <ListItem
                                    alignItems="center"
                                    key={member.id}
                                    onClick={handleToggle(member)}
                                    secondaryAction={
                                        <Checkbox
                                            edge="end"
                                            onChange={handleToggle(member)}
                                            checked={
                                                checked.indexOf(member) !== -1
                                            }
                                            inputProps={{
                                                "aria-labelledby": labelId,
                                            }}
                                        />
                                    }
                                    disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={`${member.name}`}
                                                src={`${member.image}.jpg`}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            id={labelId}
                                            primary={`${member.name}`}
                                            secondary={`${
                                                selectedCurrencyObj.symbol
                                            } ${updateDividedAmounts(member)}`}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        } else {
                            return (
                                <ListItem
                                    alignItems="center"
                                    key={member.id}
                                    disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={`${member.name}`}
                                                src={`${member.image}.jpg`}
                                            />
                                        </ListItemAvatar>
                                        {selectedSplitMethod === 1 ? (
                                            <ListItemText
                                                id={labelId}
                                                primary={`${member.name}`}
                                            />
                                        ) : (
                                            <ListItemText
                                                id={labelId}
                                                primary={`${member.name}`}
                                                secondary={`${
                                                    selectedCurrencyObj.symbol
                                                } ${updateDividedAmounts(
                                                    member,
                                                    index
                                                )}`}
                                            />
                                        )}
                                        {selectedSplitMethod === 1 ? (
                                            <>
                                                <TextField
                                                    type="text"
                                                    variant="standard"
                                                    value={Number(
                                                        subValues[
                                                            index
                                                        ].toFixed(2)
                                                    )}
                                                    inputProps={{
                                                        style: {
                                                            textAlign: "right",
                                                        },
                                                    }}
                                                    onChange={(event) => {
                                                        amountFormatter(event);
                                                        handleExactAmountChange(
                                                            index,
                                                            Number(
                                                                event.target
                                                                    .value
                                                            )
                                                        );
                                                    }}
                                                    sx={{ width: "30%" }}
                                                />
                                                <ListItemText
                                                    id={labelId}
                                                    primary={`${selectedCurrencyObj.abbreviation}`}
                                                    style={{ maxWidth: "2rem" }}
                                                />
                                            </>
                                        ) : selectedSplitMethod === 2 ? (
                                            <>
                                                <TextField
                                                    type="number"
                                                    variant="standard"
                                                    value={Number(
                                                        subValues[
                                                            index
                                                        ].toFixed(2)
                                                    )}
                                                    inputProps={{
                                                        style: {
                                                            textAlign: "right",
                                                        },
                                                    }}
                                                    onChange={(event) => {
                                                        amountFormatter(event);
                                                        handlePercentageChange(
                                                            index,
                                                            Number(
                                                                event.target
                                                                    .value
                                                            )
                                                        );
                                                    }}
                                                    sx={{ width: "30%" }}
                                                />
                                                <ListItemText
                                                    id={labelId}
                                                    primary={`%`}
                                                    style={{ maxWidth: "1rem" }}
                                                />
                                            </>
                                        ) : selectedSplitMethod === 3 ? (
                                            <>
                                                <TextField
                                                    type="number"
                                                    variant="standard"
                                                    value={Number(
                                                        subValues[
                                                            index
                                                        ].toFixed(2)
                                                    )}
                                                    inputProps={{
                                                        style: {
                                                            textAlign: "right",
                                                        },
                                                    }}
                                                    onInput={removeLeadingZeros}
                                                    onChange={(event) => {
                                                        handleShareChange(
                                                            index,
                                                            Number(
                                                                event.target
                                                                    .value
                                                            )
                                                        );
                                                    }}
                                                    sx={{ width: "30%" }}
                                                />
                                                <ListItemText
                                                    id={labelId}
                                                    primary={`share(s)`}
                                                    style={{ maxWidth: "3rem" }}
                                                />
                                            </>
                                        ) : selectedSplitMethod === 4 ? (
                                            <>
                                                <TbPlusMinus></TbPlusMinus>
                                                <TextField
                                                    type="text"
                                                    variant="standard"
                                                    value={Number(
                                                        subValues[
                                                            index
                                                        ].toFixed(2)
                                                    )}
                                                    inputProps={{
                                                        style: {
                                                            textAlign: "right",
                                                        },
                                                    }}
                                                    // onInput={inputFormatter}
                                                    onChange={(event) => {
                                                        inputFormatter(event);
                                                        handleAdjustmentChange(
                                                            index,
                                                            Number(
                                                                event.target
                                                                    .value
                                                            )
                                                        );
                                                    }}
                                                    sx={{ width: "30%" }}
                                                />
                                            </>
                                        ) : null}
                                    </ListItemButton>
                                </ListItem>
                            );
                        }
                    })}
                </List>
            </Container>
        </div>
    );
};

export default DebtorsBlock;
