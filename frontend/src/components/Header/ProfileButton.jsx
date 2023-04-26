import { Avatar, ListItemButton, ListItemText } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import ProfileModal from "./ProfileModal";

const ProfileButton = () => {
    const { user } = useContext(AuthContext);

    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleOpenProfileModal = () => {
        setShowProfileModal(true);
    };

    const handleCloseProfileModal = () => {
        setShowProfileModal(false);
    };

    return (
        <>
            <ListItemButton
                sx={{
                    height: "3.5rem",
                }}
                onClick={handleOpenProfileModal}
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
                <Avatar
                    alt={user.name}
                    src={user.image}
                    sx={{ border: "1px solid white" }}
                />
            </ListItemButton>
            <ProfileModal
                showProfileModal={showProfileModal}
                handleCloseProfileModal={handleCloseProfileModal}
            ></ProfileModal>
        </>
    );
};

export default ProfileButton;
