import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import { Container, Form, Row, Col } from "react-bootstrap";
import { SPLIT_METHODS } from "../../../global/constant";

const SplitMethodSelector = ({ handleSplitMethodChange }) => {
    const handleChangeSplitMethodEvent = (event) => {
        handleSplitMethodChange(event.target.value);
        console.log(event.target.value);
    };
    return (
        <Form.Select onChange={handleChangeSplitMethodEvent}>
            {SPLIT_METHODS.map((method, index) => (
                <option key={index} value={index}>
                    {method}
                </option>
            ))}
        </Form.Select>
    );
};

export default function DebtorList({
    members,
    currencies,
    selectedCurrency,
    amount,
    handleSplitMethodChange,
}) {
    const [selectedCurrencyObj] = currencies.filter((currency) => {
        return currency.id === Number(selectedCurrency);
    });

    const [checked, setChecked] = useState([...members]);

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

    return (
        <div className="debtor-list">
            <Container as={Row} className="debtor-header-container">
                <Form.Label column lg="6">
                    For whom
                </Form.Label>
                <Col lg="6">
                    <SplitMethodSelector
                        handleSplitMethodChange={handleSplitMethodChange}
                    />
                </Col>
            </Container>
            <Container className="debtor-list-container">
                <List
                    dense
                    sx={{
                        width: "100%",
                        maxWidth: 360,
                        bgcolor: "background.paper",
                    }}
                >
                    {members.map((member) => {
                        const labelId = `checkbox-list-secondary-label-${member.id}`;
                        return (
                            <ListItem
                                alignItems="center"
                                key={member.id}
                                secondaryAction={
                                    <Checkbox
                                        edge="end"
                                        onChange={handleToggle(member)}
                                        checked={checked.indexOf(member) !== -1}
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
                    })}
                </List>
            </Container>
        </div>
    );
}
