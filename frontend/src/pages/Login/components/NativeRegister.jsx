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

const NativeRegister = () => {
    const { setHaveAccount, nativeSignUp } = useContext(AuthContext);
    const [signUpForm, setSignUpForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSignUpChange = (event) => {
        const key = event.target.name;
        setSignUpForm({ ...signUpForm, [key]: event.target.value });
    };
    return (
        <>
            <LoginFormContainer
                onSubmit={(event) => {
                    event.preventDefault();
                    nativeSignUp(signUpForm);
                }}
            >
                <WelcomeImage src="/greeting.svg"></WelcomeImage>

                <InputField
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={signUpForm.name}
                    onChange={handleSignUpChange}
                    autoComplete="on"
                    required
                />
                <InputField
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={signUpForm.email}
                    onChange={handleSignUpChange}
                    autoComplete="on"
                    required
                />
                <InputField
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={signUpForm.password}
                    onChange={handleSignUpChange}
                    autoComplete="on"
                    required
                />

                <LoginButton>Register</LoginButton>
                <HaveAccountAlready onClick={() => setHaveAccount(true)}>
                    Already have an account?
                </HaveAccountAlready>
            </LoginFormContainer>
        </>
    );
};

export { NativeRegister };
