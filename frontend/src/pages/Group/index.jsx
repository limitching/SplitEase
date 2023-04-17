import GroupDashboard from "./components/Dashboard";
import Tabs from "./components/Tabs";
import Error from "./components/Error";
import { ExpenseContextProvider } from "../../contexts/ExpenseContext";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { useContext } from "react";
import { GroupContext } from "../../contexts/GroupContext";

const WrapperGroupContainer = styled.div`
    padding-top: 5vh;
    height: 100vh;
    padding-bottom: 5vh;
`;

const Group = () => {
    const { group } = useContext(GroupContext);

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
