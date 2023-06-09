import { Avatar, ListItemButton, ListItemText } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import ProfileModal from "./ProfileModal";
import { AVATAR_LINK, DEFAULT_AVATAR } from "../../global/constant";

const ProfileButton = () => {
    const { user } = useContext(AuthContext);

    const [showProfileModal, setShowProfileModal] = useState(false);
    const [modifiedUserName, setModifiedUserName] = useState("");
    const [modifiedUserImage, setModifiedUserImage] = useState(user.image);

    useEffect(() => {
        setModifiedUserName(user.name);
    }, [user]);

    const handleOpenProfileModal = () => {
        setModifiedUserName(user.name);
        setModifiedUserImage(user.image);
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
                    primaryTypographyProps={{
                        maxWidth: "12vw",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                    secondaryTypographyProps={{
                        maxWidth: "15vw",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                    sx={{
                        textAlign: "right",
                        paddingRight: "1rem",
                        "@media (max-width: 768px)": {
                            display: "none",
                        },
                    }}
                />
                <Avatar
                    alt={user.name}
                    src={
                        user.image
                            ? user.image
                            : AVATAR_LINK +
                              DEFAULT_AVATAR[user.id % DEFAULT_AVATAR.length]
                    }
                    sx={{ border: "1px solid white" }}
                />
            </ListItemButton>
            <ProfileModal
                showProfileModal={showProfileModal}
                handleCloseProfileModal={handleCloseProfileModal}
                modifiedUserName={modifiedUserName}
                modifiedUserImage={modifiedUserImage}
                setModifiedUserName={setModifiedUserName}
                setModifiedUserImage={setModifiedUserImage}
            ></ProfileModal>
        </>
    );
};

export default ProfileButton;
