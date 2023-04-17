import { useContext } from "react";
import { GroupContext } from "../../../contexts/GroupContext";
import { AuthContext } from "../../../contexts/AuthContext";
import styled from "styled-components";
const ErrorPage = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ErrorContainer = styled.div`
    width: 50%;
    max-width: 600px;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f2f2f2;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 2rem;
`;
const ErrorTitle = styled.h1`
    font-size: 3rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1rem;
`;
const ErrorMessage = styled.p`
    font-size: 1.25rem;
    text-align: center;
    color: #555;
`;
const ErrorImage = styled.img`
    max-width: 50%;
    height: auto;
    margin-bottom: 2rem;
`;

const Error = () => {
    const { group, error } = useContext(GroupContext);
    const { isLogin } = useContext(AuthContext);

    return (
        <ErrorPage>
            <ErrorContainer>
                <ErrorTitle>Oops!</ErrorTitle>
                <ErrorMessage>
                    It looks like you don't have permission to access this page.
                </ErrorMessage>
                <ErrorImage src="/feeling_blue.svg" alt="Sad Face"></ErrorImage>
            </ErrorContainer>
        </ErrorPage>
    );
};

export default Error;