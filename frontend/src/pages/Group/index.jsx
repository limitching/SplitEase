import GroupDashboard from "./components/Dashboard";
import Tabs from "./components/Tabs";
import Error from "./components/Error";
import { ExpenseContextProvider } from "../../contexts/ExpenseContext";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useContext, useState, useRef, useEffect } from "react";
import { GroupContext } from "../../contexts/GroupContext";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../../components/Preloader/Preloader";
import { GROUP_BG_COLOR } from "../../global/constant";
import Invitation from "./components/Invitation";
import Footer from "../../components/Footer";
import TourIcon from "@mui/icons-material/Tour";
import JoyRide from "react-joyride";
import { handleJoyrideCallback, STEP, STYLES } from "../../utils/joyride";
import Fab from "@mui/material/Fab";

const WrapperGroupContainer = styled.div`
    padding-top: 55px;
    // padding-bottom: 55px;
    width: 100vw;
    // height: auto;
    // min-hight: 100vh;
    // height: calc(100vh - 55px);
    background-color: ${GROUP_BG_COLOR};
    // border: 2px solid black;
`;

const ErrorContainer = styled.div`
    width: 100vw;
    height: calc(100vh - 55px);
    background-color: ${GROUP_BG_COLOR};
`;

const InvitationContainer = styled.div`
    width: 100vw;
    height: calc(100vh - 55px - 56px);
    background-color: ${GROUP_BG_COLOR};
`;

const WrapperOutlet = styled.div`
    // padding-bottom: 55px;
    width: 100vw;
    // height: auto;
    // min-hight: 100vh;
    height: calc(100vh - 55px - 300px - 52px);
    // background-color: ${GROUP_BG_COLOR};
    overflow-y: scroll;
    // border: 2px solid black;

    @media (min-width: 768px) {
        height: calc(100vh - 55px - 30vh - 52px);
    }
`;

const Group = () => {
    const {
        group,
        isLoading,
        isPublicVisit,
        wrapperOutletRef,
        setShowFixedButton,
        slug,
    } = useContext(GroupContext);
    const { loading } = useContext(AuthContext);
    const timeoutRef = useRef(null);
    const [scrollOffset, setScrollOffset] = useState(0);
    const [joyrideState, setJoyrideState] = useState({
        run: false,
        steps: STEP,
        stepIndex: 0,
        paused: false, // 新增 paused 屬性
        redirectToExpenses: false, // 新增 redirectToExpenses 屬性
        redirectToDebts: false,
        redirectToSettlement: false,
        redirectToMembers: false,
        redirectToActivities: false,
        redirectToJoin: false,
    });

    const navigate = useNavigate();

    useEffect(() => {
        // console.log(joyrideState);
        if (joyrideState.redirectToExpenses) {
            setJoyrideState({ ...joyrideState, redirectToExpenses: false });
            navigate(`/group/${slug}/expenses`);
        }
        if (joyrideState.redirectToDebts) {
            setJoyrideState({ ...joyrideState, redirectToDebts: false });
            navigate(`/group/${slug}/debts`);
        }
        if (joyrideState.redirectToSettlement) {
            setJoyrideState({ ...joyrideState, redirectToSettlement: false });
            navigate(`/group/${slug}/settlement`);
        }
        if (joyrideState.redirectToMembers) {
            setJoyrideState({ ...joyrideState, redirectToMembers: false });
            navigate(`/group/${slug}/members`);
        }
        if (joyrideState.redirectToActivities) {
            setJoyrideState({ ...joyrideState, redirectToActivities: false });
            navigate(`/group/${slug}/activities`);
        }
        if (joyrideState.redirectToJoin) {
            setJoyrideState({ ...joyrideState, redirectToJoin: false });
            navigate(`/group/${slug}/join`);
        }
    }, [joyrideState, navigate, slug]);

    if (isLoading || loading) {
        return <Loading />;
    }

    function handleScroll() {
        const wrapperElement = wrapperOutletRef.current;
        const currentScrollOffset = wrapperElement.scrollTop;
        // console.log(currentScrollOffset);
        // console.log(currentScrollOffset - scrollOffset);

        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);

            // calculate scroll div
            const delta = Math.abs(currentScrollOffset - scrollOffset);
            if (delta > 5) {
                if (currentScrollOffset > scrollOffset) {
                    // console.log(
                    //     "Scroll offset difference is greater than 5px! delta>0"
                    // );
                    setShowFixedButton(false);
                } else {
                    // console.log(
                    //     "Scroll offset difference is greater than 5px! delta<0"
                    // );
                    setShowFixedButton(true);
                }
            }

            timeoutRef.current = null;
        }

        setScrollOffset(currentScrollOffset);

        // If still on scrolling, wait 0.2 sec
        if (timeoutRef.current === null) {
            timeoutRef.current = setTimeout(() => {
                timeoutRef.current = null;
            }, 200);
        }
    }

    function handleStartGuide() {
        setJoyrideState({
            ...joyrideState,
            run: true,
            stepIndex: 0,
        });
    }

    return (
        <ExpenseContextProvider>
            {Object.keys(group).length !== 0 ? (
                isPublicVisit ? (
                    <WrapperGroupContainer>
                        <InvitationContainer>
                            <Invitation></Invitation>
                        </InvitationContainer>
                        <Footer></Footer>
                    </WrapperGroupContainer>
                ) : (
                    <WrapperGroupContainer>
                        <GroupDashboard></GroupDashboard>
                        <Tabs></Tabs>
                        <WrapperOutlet
                            ref={wrapperOutletRef}
                            onScroll={handleScroll}
                        >
                            <Outlet></Outlet>
                            <Footer></Footer>
                        </WrapperOutlet>
                        <Fab
                            id="guide"
                            color="primary"
                            sx={{
                                position: "fixed",
                                right: "1rem",
                                top: "calc(56px + 1rem)",
                            }}
                            onClick={handleStartGuide}
                        >
                            <TourIcon></TourIcon>
                        </Fab>
                        <JoyRide
                            styles={STYLES}
                            continuous
                            hideCloseButton
                            scrollToFirstStep
                            showProgress
                            showSkipButton
                            {...joyrideState}
                            callback={(data) =>
                                handleJoyrideCallback(
                                    data,
                                    joyrideState,
                                    setJoyrideState
                                )
                            }
                        ></JoyRide>
                    </WrapperGroupContainer>
                )
            ) : (
                <WrapperGroupContainer>
                    <ErrorContainer>
                        <Error></Error>
                    </ErrorContainer>
                    <Footer></Footer>
                </WrapperGroupContainer>
            )}
        </ExpenseContextProvider>
    );
};

export default Group;
