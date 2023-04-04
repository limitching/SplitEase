import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import { api } from "../../../utils/api";

export default function CheckboxListSecondary() {
    const [members, setMembers] = useState([]);
    const [checked, setChecked] = useState([1]);

    async function fetchMembers(gid) {
        try {
            const data = await api.getMembers(gid);
            setMembers(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const gid = "backendawesome";
        fetchMembers(gid);
    }, []);

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
                                secondary="NT$"
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}
