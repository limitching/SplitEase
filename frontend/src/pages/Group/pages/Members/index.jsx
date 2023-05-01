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

const Members = () => {
    const navigate = useNavigate();
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
            <FixedButtonWrapper>
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
