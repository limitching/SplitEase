import GroupDashboard from "./components/Dashboard";
import Tabs from "./components/Tabs";
import Error from "./components/Error";
import { ExpenseContextProvider } from "../../contexts/ExpenseContext";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { useContext, useState, useRef } from "react";
import { GroupContext } from "../../contexts/GroupContext";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import { GROUP_BG_COLOR } from "../../global/constant";
import Invitation from "./components/Invitation";
import Footer from "../../components/Footer";

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
const WrapperOutlet = styled.div`
    // padding-bottom: 55px;
    width: 100vw;
    // height: auto;
    // min-hight: 100vh;
    height: calc(100vh - 55px - 300px - 52px);
    // background-color: ${GROUP_BG_COLOR};
    overflow: scroll;
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
    } = useContext(GroupContext);
    const { loading } = useContext(AuthContext);
    const timeoutRef = useRef(null);
    const [scrollOffset, setScrollOffset] = useState(0);

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

    return (
        <ExpenseContextProvider>
            {Object.keys(group).length !== 0 ? (
                isPublicVisit ? (
                    <WrapperGroupContainer>
                        <Invitation></Invitation>
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
                    </WrapperGroupContainer>
                )
            ) : (
                <WrapperGroupContainer>
                    <Error></Error>
                </WrapperGroupContainer>
            )}
        </ExpenseContextProvider>
    );
};

export default Group;
