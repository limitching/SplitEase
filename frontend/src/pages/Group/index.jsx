import GroupDashboard from "./components/Dashboard";
import Tabs from "./components/Tabs";
import { GroupContextProvider } from "../../contexts/GroupContext";
import { ExpenseContextProvider } from "../../contexts/ExpenseContext";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const WrapperGroupContainer = styled.div`
    padding-top: 5vh;
    height: 100vh;
    padding-bottom: 5vh;
`;

const Group = () => {
    return (
        <GroupContextProvider>
            <ExpenseContextProvider>
                <WrapperGroupContainer>
                    <GroupDashboard></GroupDashboard>
                    <Tabs></Tabs>
                    <Outlet></Outlet>
                </WrapperGroupContainer>
            </ExpenseContextProvider>
        </GroupContextProvider>
    );
};

export default Group;
