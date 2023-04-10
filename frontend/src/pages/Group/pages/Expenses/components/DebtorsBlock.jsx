import { Container, Form, Col, Row } from "react-bootstrap";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { useContext } from "react";
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
        setSelectedSplitMethod(event.target.value);
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
    setSelectedSplitMethod,
    checked,
    setChecked,
    selectedSplitMethod,
}) => {
    const { members, setMembers, gid } = useContext(GroupContext);
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
                    {members.map((member) => {
                        const labelId = `checkbox-list-secondary-label-${member.id}`;
                        return (
                            <ListItem
                                alignItems="center"
                                key={member.id}
                                onClick={handleToggle(member)}
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
};

export default DebtorsBlock;
