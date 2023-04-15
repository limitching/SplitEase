import styled from "styled-components";
import { NativeLogin } from "./components/NativeLogin";
import { useState } from "react";
import { FaLine } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { api } from "../../utils/api";

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

const LineLoginButton = styled.button`
    background-color: #06c755;
    color: white;
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 5px;
    margin-right: 10px;
    cursor: pointer;

    &:hover {
        background-color: rgba(6, 199, 85, 0.9);
        color: black;
    }

    &:active {
        background-color: rgba(0, 0, 0, 0.3);
    }
`;

const LineLoginIcon = styled(FaLine)`
    font-size: 24px;
    margin-right: 10px;
`;

const LoginTerms = styled.div`
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    line-height: 1.5;
    a {
        color: #6c63ff;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
    @media (max-width: 768px) {
        text-align: left;
    }
`;

const Login = () => {
    const [loginMethod, setLoginMethod] = useState(null);
    const location = useLocation();
    console.log(location);
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    console.log(code, state);
    const handleSignIn = async () => {
        const data = { provider: "line", code, state };
        const result = await api.userSignIn(data);
        console.log("result", result);
    };
    if (code && state) {
        handleSignIn(code, state);
    }

    const handleLoginMethod = (method) => {
        setLoginMethod(method);
    };

    const handleLineLogin = () => {
        const clientId = "1660896460";
        const redirectUri = encodeURIComponent("http://localhost:3001/login");
        const state = "login";
        const scope = "openid%20profile%20email";
        const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
        window.location.href = url;
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
                        <LineLoginButton
                            isActive={loginMethod === "line"}
                            onClick={() => handleLineLogin()}
                        >
                            <LineLoginIcon></LineLoginIcon>
                            Sign in with LINE
                        </LineLoginButton>
                        <LoginButton
                            isActive={loginMethod === "native"}
                            onClick={() => handleLoginMethod("native")}
                        >
                            Sign in with Email
                        </LoginButton>
                        <LoginTerms>
                            By continuing, you are indicating that you accept
                            our
                            <br /> <a href="/">Terms of Service</a> and{" "}
                            <a href="/">Privacy Policy</a>.
                        </LoginTerms>
                    </LoginMethod>
                </LoginBox>
            ) : (
                <NativeLogin></NativeLogin>
            )}
        </WrapperLoginContainer>
    );
};

export { Login };
