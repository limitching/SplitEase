import styled from "styled-components";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

const WelcomeImage = styled.img`
    height: 120px;
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

const LoginFormContainer = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 500px;
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.input`
    width: 80%;
    padding: 10px;
    margin-bottom: 20px;
    border: none;
    border-bottom: 1px solid #ccc;
    outline: none;
    font-size: 16px;
    color: #444;
    &::placeholder {
        color: #999;
    }
`;

const LoginButton = styled.button`
    width: 80%;
    padding: 10px;
    background-color: #008cba;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    &:hover {
        background-color: #006d87;
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

const OtherLoginMethod = styled.a`
    margin-top: 20px;
    display: flex;
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
    color: ${(props) => props.theme.textColor};
`;

const NativeLogin = () => {
    const { setHaveAccount, setLoginMethod, nativeSignIn } =
        useContext(AuthContext);
    const [signInForm, setSignInForm] = useState({
        provider: "native",
        email: "",
        password: "",
    });

    const handleSignInChange = (event) => {
        const key = event.target.name;
        setSignInForm({ ...signInForm, [key]: event.target.value });
    };
    return (
        <>
            <LoginFormContainer>
                <WelcomeImage src="/summer.svg"></WelcomeImage>
                <InputField
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={signInForm.email}
                    onChange={handleSignInChange}
                    autoComplete="on"
                />
                <InputField
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={signInForm.password}
                    onChange={handleSignInChange}
                    autoComplete="on"
                />
                <LoginButton
                    onClick={(event) => {
                        event.preventDefault();
                        nativeSignIn(signInForm);
                    }}
                >
                    Login
                </LoginButton>
                <HaveAccountAlready onClick={() => setHaveAccount(false)}>
                    Don't have an account yet?
                </HaveAccountAlready>
                <OtherLoginMethod onClick={() => setLoginMethod(null)}>
                    Other login methods
                </OtherLoginMethod>
            </LoginFormContainer>
        </>
    );
};

export { NativeLogin };
