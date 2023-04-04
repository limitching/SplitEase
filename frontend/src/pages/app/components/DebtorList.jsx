import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import { api } from "../../../utils/api";

export default function CheckboxListSecondary({
    members,
    currencies,
    selectedCurrency,
}) {
    const [checked, setChecked] = useState([1]);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    const [selectedCurrencyObj] = currencies.filter(
        (currency) => currency.id == selectedCurrency
    );

    return (
        <List
            dense
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
            {members.map((member) => {
                const labelId = `checkbox-list-secondary-label-${member.id}`;
                return (
                    <ListItem
                        key={member.id}
                        secondaryAction={
                            <Checkbox
                                edge="end"
                                onChange={handleToggle(member)}
                                checked={checked.indexOf(member) !== -1}
                                inputProps={{ "aria-labelledby": labelId }}
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
                                secondary={`${selectedCurrencyObj.symbol}`}
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}
