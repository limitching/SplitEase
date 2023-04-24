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

const WrapperGroupContainer = styled.div`
    padding-top: 55px;
    height: 100vh;
    padding-bottom: 55px;
    background-color: ${GROUP_BG_COLOR};
`;

const Group = () => {
    const { group, isLoading } = useContext(GroupContext);
    const { loading } = useContext(AuthContext);
    if (isLoading || loading) {
        return <Loading />;
    }

    return (
        <ExpenseContextProvider>
            {Object.keys(group).length !== 0 ? (
                <WrapperGroupContainer>
                    <GroupDashboard></GroupDashboard>
                    <Tabs></Tabs>
                    <Outlet></Outlet>
                </WrapperGroupContainer>
            ) : (
                <WrapperGroupContainer>
                    <Error></Error>
                </WrapperGroupContainer>
            )}
        </ExpenseContextProvider>
    );
};

export default Group;
