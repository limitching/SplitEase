import GroupDashboard from "./components/Dashboard";
import Tabs from "./components/Tabs";
import Error from "./components/Error";
import { ExpenseContextProvider } from "../../contexts/ExpenseContext";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { useContext } from "react";
import { GroupContext } from "../../contexts/GroupContext";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import { GROUP_BG_COLOR } from "../../global/constant";
import Invitation from "./components/Invitation";
import Footer from "../../components/Footer";

const WrapperGroupContainer = styled.div`
    padding-top: 53px;
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
    height: calc(100vh - 56px - 300px - 48px);
    // background-color: ${GROUP_BG_COLOR};
    overflow: scroll;
    border: 2px solid black;

    @media (min-width: 768px) {
        height: calc(100vh - 55px - 30vh - 48px);
    }
`;

const Group = () => {
    const { group, isLoading, isPublicVisit } = useContext(GroupContext);
    const { loading } = useContext(AuthContext);
    if (isLoading || loading) {
        return <Loading />;
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
                        <WrapperOutlet>
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
