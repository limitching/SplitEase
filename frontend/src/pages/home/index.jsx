import styled from "styled-components";
import GroupsContainer from "./components/GroupsContainer";

const HomeContainer = styled.div`
    width: 100%;
    padding-top: 5vh;
    height: 100vh;
    padding-bottom: 5vh;
    background-color: skyblue;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;
const Home = () => {
    return (
        <HomeContainer>
            <GroupsContainer></GroupsContainer>
        </HomeContainer>
    );
};

export default Home;
