import GroupDashboard from "./components/Dashboard";
import Tabs from "./components/Tabs";
import Error from "./components/Error";
import { GroupContextProvider } from "../../contexts/GroupContext";
import { ExpenseContextProvider } from "../../contexts/ExpenseContext";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { GroupContext } from "../../contexts/GroupContext";

const WrapperGroupContainer = styled.div`
    padding-top: 5vh;
    height: 100vh;
    padding-bottom: 5vh;
`;

const Group = () => {
    const { isLogin } = useContext(AuthContext);
    const { group } = useContext(GroupContext);
    console.log("isLogin", isLogin);
    const { loading } = useContext(AuthContext);
    console.log("isLogin", isLogin);
    console.log("loading", loading);
    console.log("group", group);
    return (
        <GroupContextProvider>
            <ExpenseContextProvider>
                {isLogin || group.id ? (
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
        </GroupContextProvider>
    );
};

export default Group;
