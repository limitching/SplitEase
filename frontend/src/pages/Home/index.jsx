import styled from "styled-components";
import GroupsContainer from "./components/GroupsContainer";
import { GRAY_8 } from "../../global/constant";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const HomeContainer = styled.div`
    width: 100%;
    padding-top: 5vh;
    height: 100vh;
    padding-bottom: 5vh;
    background-color: ${GRAY_8};
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;
const Home = () => {
    const navigate = useNavigate();
    const { isLogin } = useContext(AuthContext);
    if (!isLogin) {
        return navigate("/login");
    }
    return (
        <HomeContainer>
            <GroupsContainer></GroupsContainer>
        </HomeContainer>
    );
};

export default Home;
