import styled from "styled-components";
import { NativeLogin } from "./components/NativeLogin";
import { useState } from "react";

const WrapperLoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 5vh;
    height: 100vh;
    padding-bottom: 5vh;
    background-color: grey;
`;

const LoginBox = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
`;

const LoginMethod = styled.div`
    display: flex;
    gap: 1rem;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 20px;
`;

const LoginButton = styled.button`
    background-color: ${({ isActive }) => (isActive ? "#4285f4" : "#f2f2f2")};
    color: ${({ isActive }) => (isActive ? "white" : "black")};
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 5px;
    margin-right: 10px;
    cursor: pointer;

    &:hover {
        background-color: ${({ isActive }) =>
            isActive ? "#357ae8" : "#e6e6e6"};
    }
`;

const Login = () => {
    const [loginMethod, setLoginMethod] = useState(null);

    const handleLoginMethod = (method) => {
        setLoginMethod(method);
    };

    return (
        <WrapperLoginContainer>
            {loginMethod === null ? (
                <LoginBox>
                    <LoginMethod>
                        <LoginButton
                            isActive={loginMethod === "google"}
                            onClick={() => handleLoginMethod("google")}
                        >
                            Sign in with Google
                        </LoginButton>
                        <LoginButton
                            isActive={loginMethod === "line"}
                            onClick={() => handleLoginMethod("line")}
                        >
                            Sign in with LINE
                        </LoginButton>
                        <LoginButton
                            isActive={loginMethod === "native"}
                            onClick={() => handleLoginMethod("native")}
                        >
                            Sign in with Email
                        </LoginButton>
                    </LoginMethod>
                </LoginBox>
            ) : (
                <NativeLogin></NativeLogin>
            )}
        </WrapperLoginContainer>
    );
};

export { Login };
