import { Avatar, ListItemButton, ListItemText } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const ProfileButton = () => {
    const { user } = useContext(AuthContext);

    return (
        <ListItemButton
            sx={{
                height: "3.5rem",
            }}
        >
            <ListItemText
                id={"profile-button-text"}
                primary={user.name}
                secondary={user.email}
                sx={{
                    textAlign: "right",
                    paddingRight: "1rem",
                }}
            />
            <Avatar alt={user.name} src={user.image} />
        </ListItemButton>
    );
};

export default ProfileButton;
