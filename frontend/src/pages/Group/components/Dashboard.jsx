import styled from "styled-components";
import { useContext } from "react";
import { GroupContext } from "../../../contexts/GroupContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { Avatar } from "@mui/material";

const Dashboard = styled.div`
    width: 100%;
    height: 300px;
    background-color: #f4f4f4;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const VisitorDashboard = styled(Dashboard)`
    background-color: #f4f4f4;
`;

const UserDashboard = styled(Dashboard)`
    background-color: #c5e0dc;
`;

const JoinButton = styled.button`
    background-color: #00b2a5;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.2s ease-in-out;
    &:hover {
        background-color: #008c7d;
    }
    &:active {
        transform: scale(0.98);
    }
`;

const GroupDashboard = () => {
    const { group, members, invitation_code, slug } = useContext(GroupContext);
    const { userGroups, jwtToken, isLogin, joinGroup } =
        useContext(AuthContext);

    const [owner] = members.filter((user) => user.id === group.owner);

    const filterResult = userGroups.filter(
        (userGroup) => userGroup.id === group.id
    );

    if (filterResult.length === 0) {
        return (
            <VisitorDashboard>
                <Avatar
                    alt={owner.name}
                    src={owner.image}
                    sx={{ width: 100, height: 100, fontSize: "3rem" }}
                ></Avatar>
                <h3>{`${owner.name} wants to invite you to a group`} </h3>
                <h1>{group.name}</h1>
                <h3>{group.description}</h3>
                {isLogin ? (
                    <JoinButton
                        onClick={() =>
                            joinGroup(slug, invitation_code, jwtToken)
                        }
                    >
                        Join Group
                    </JoinButton>
                ) : (
                    <JoinButton disabled>Please Login</JoinButton>
                )}
            </VisitorDashboard>
        );
    }

    return (
        <UserDashboard>
            <h1>{group.name}</h1>
            <h3>{group.description}</h3>
        </UserDashboard>
    );
};
export default GroupDashboard;
