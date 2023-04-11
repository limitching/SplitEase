import { Container, Form, Col, Row } from "react-bootstrap";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { useContext, useState } from "react";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Checkbox,
    Avatar,
} from "@mui/material";
import { SPLIT_METHODS } from "../../../../../global/constant";

const SplitMethodSelector = ({
    selectedSplitMethod,
    setSelectedSplitMethod,
}) => {
    const handleSplitMethodChange = (event) => {
        setSelectedSplitMethod(Number(event.target.value));
        //TODO:
        console.log(
            "selectedSplitMethod",
            selectedSplitMethod,
            typeof selectedSplitMethod
        );
    };
    return (
        <Form.Select
            onChange={handleSplitMethodChange}
            defaultValue={selectedSplitMethod}
        >
            {SPLIT_METHODS.map((method, index) => (
                <option key={index} value={index}>
                    {method}
                </option>
            ))}
        </Form.Select>
    );
};

const DebtorsBlock = ({
    currencies,
    selectedCurrency,
    amount,
    setAmount,
    setSelectedSplitMethod,
    checked,
    setChecked,
    selectedSplitMethod,
}) => {
    const { members } = useContext(GroupContext);
    const [subValues, setSubValues] = useState(Array(members.length).fill(0));
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

    // A function to update amount
    const updateDividedAmounts = (member) => {
        const currentIndex = checked.indexOf(member);
        if (currentIndex === -1) {
            return 0;
        } else {
            return parseFloat(Number(amount / checked.length).toFixed(2));
        }
    };

    const handleExactAmountChange = (index, newValue) => {
        const newSubValues = [...subValues];
        newSubValues[index] = newValue;
        setSubValues(newSubValues);

        const newAmount = newSubValues.reduce((sum, value) => sum + value, 0);
        setAmount(newAmount);
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
                        // setShowInput={setShowInput}
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
                                        <ListItemText
                                            id={labelId}
                                            primary={`${member.name}`}
                                        />
                                        <input
                                            type="number"
                                            value={subValues[index]}
                                            onChange={(event) =>
                                                handleExactAmountChange(
                                                    index,
                                                    Number(event.target.value)
                                                )
                                            }
                                        />
                                        {selectedSplitMethod === 1 ? (
                                            <ListItemText
                                                id={labelId}
                                                primary={`${selectedCurrencyObj.abbreviation}`}
                                            />
                                        ) : selectedSplitMethod === 2 ? (
                                            <ListItemText
                                                id={labelId}
                                                primary={`%`}
                                            />
                                        ) : (
                                            <ListItemText
                                                id={labelId}
                                                primary={`share(s)`}
                                            />
                                        )}
                                        {/* <ListItemText
                                            id={labelId}
                                            primary={`${selectedCurrencyObj.abbreviation}`}
                                        /> */}
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
