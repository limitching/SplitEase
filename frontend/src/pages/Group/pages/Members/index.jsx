import {
    PageWrapper,
    ListWrapper,
    HeaderTextContainer,
    FixedButtonWrapper,
} from "../../components/PageWrapper";
import MemberList from "./components/MemberList";
import { DASHBOARD_BG_COLOR } from "../../../../global/constant";
import { Button } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GroupContext } from "../../../../contexts/GroupContext";

const Members = () => {
    const navigate = useNavigate();
    const { showFixedButton } = useContext(GroupContext);

    return (
        <>
            <PageWrapper>
                <HeaderTextContainer>
                    <h6>Members</h6>
                </HeaderTextContainer>
                <ListWrapper>
                    <MemberList></MemberList>
                </ListWrapper>
            </PageWrapper>
            <FixedButtonWrapper
                style={{
                    transition:
                        "transform 0.5s ease-out, opacity 0.5s ease-out",
                    transform: showFixedButton
                        ? "translateY(0)"
                        : "translateY(120%)",
                    opacity: showFixedButton ? 1 : 0,
                }}
            >
                <Button
                    color="primary"
                    disabled={false}
                    size="large"
                    variant="filled"
                    startIcon={<PersonAddIcon></PersonAddIcon>}
                    onClickCapture={() => {
                        navigate("../join");
                    }}
                    sx={{
                        bgcolor: DASHBOARD_BG_COLOR,
                        "&:hover": {
                            bgcolor: DASHBOARD_BG_COLOR,
                            opacity: 0.87,
                        },
                        borderRadius: "100px",
                        color: "white",
                        padding: "12px 26px",
                    }}
                >
                    INVITE FRIENDS
                </Button>
            </FixedButtonWrapper>
        </>
    );
};
export default Members;
