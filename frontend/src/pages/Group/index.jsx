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

const WrapperGroupContainer = styled.div`
    padding-top: 53px;
    padding-bottom: 55px;
    width: 100vw;
    height: 100vh;
    background-color: ${GROUP_BG_COLOR};
    // border: 2px solid black;
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
                        <Outlet></Outlet>
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
