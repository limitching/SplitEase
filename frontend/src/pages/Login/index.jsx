import styled from "styled-components";
import { NativeLogin } from "./components/NativeLogin";
import { NativeRegister } from "./components/NativeRegister";
import { useContext, useEffect } from "react";
import { FaLine } from "react-icons/fa";
import { GoMail } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";

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

const WelcomeImage = styled.img`
    height: 160px;
    margin-top: 2rem;
    margin-bottom: 2rem;
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

const HaveAccountAlready = styled.a`
    margin-top: 20px;
    display: flex;
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
    color: ${(props) => props.theme.textColor};
`;

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        loading,
        isLogin,
        haveAccount,
        loginMethod,
        setHaveAccount,
        lineSignIn,
        setLoginMethod,
    } = useContext(AuthContext);

    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    const handleLoginMethod = (method) => {
        setLoginMethod(method);
    };

    const navigateToLineLogin = () => {
        const clientId = "1660896460";
        const redirectUri = encodeURIComponent("http://localhost:3001/login");
        const state = "login";
        const scope = "openid%20profile%20email";
        const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
        window.location.href = url;
    };

    useEffect(() => {
        if (loading) {
            return;
        }

        if (isLogin) {
            navigate("/home");
        }

        if (code && state) {
            lineSignIn(code, state);
        }
    }, [loading, isLogin, code, state, navigate, lineSignIn]);

    return (
        <WrapperLoginContainer>
            {haveAccount === true ? (
                loginMethod === null ? (
                    <LoginBox>
                        <LoginMethod>
                            <WelcomeImage src="/mornings.svg"></WelcomeImage>
                            <LineLoginButton
                                isActive={loginMethod === "line"}
                                onClick={() => navigateToLineLogin()}
                            >
                                <LineLoginIcon></LineLoginIcon>
                                Sign in with LINE
                            </LineLoginButton>
                            <LoginButton
                                isActive={loginMethod === "native"}
                                onClick={() => handleLoginMethod("native")}
                            >
                                <GoMail />
                                <span> </span>
                                Sign in with Email
                            </LoginButton>
                            <LoginTerms>
                                By continuing, you are indicating that you
                                accept our
                                <br /> <a href="/">Terms of Service</a> and{" "}
                                <a href="/">Privacy Policy</a>.
                            </LoginTerms>
                            <HaveAccountAlready
                                onClick={() => setHaveAccount(false)}
                            >
                                Don't have an account yet?
                            </HaveAccountAlready>
                        </LoginMethod>
                    </LoginBox>
                ) : (
                    <WrapperLoginContainer>
                        <NativeLogin />
                    </WrapperLoginContainer>
                )
            ) : (
                <WrapperLoginContainer>
                    <NativeRegister />
                </WrapperLoginContainer>
            )}
        </WrapperLoginContainer>
    );
};

export default Login;
