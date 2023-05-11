import styled from "styled-components";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import TextField from "@mui/material/TextField";
import validator from "validator";
import { HEADER_BG_COLOR } from "../../../global/constant";

const WelcomeImage = styled.img`
    width: 100%;
    max-width: 250px;
    // margin-top: 2rem;
    // margin-bottom: 2rem;
    @media (max-width: 768px) {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
    }
`;

const LoginFormContainer = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 450px;
    padding: 2rem 1rem;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    @media (max-width: 768px) {
        width: 100%;
        margin: 0 auto;
    }
`;

const LoginContentContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    @media (max-width: 768px) {
        width: 100%;
        margin: 0 auto;
    }
`;

const InputField = styled(TextField)`
    width: 90%;
    max-width: 400px;
    padding: 10px;
    margin-bottom: 20px;
    border: none;
    border-bottom: 1px solid #ccc;
    outline: none;
    font-size: 16px;
    color: #444;
    flex: 1;
    &::placeholder {
        color: #999;
    }
    @media (max-width: 768px) {
        width:100%;
        max-width: 100%;
        margin: 0 auto;
    }
`;

const LoginButton = styled.button`
    width: 90%;
    max-width: 400px;
    padding: 10px;
    background-color: ${HEADER_BG_COLOR};
    border: none;
    border-radius: 4px;
    margin-top: 1rem;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    &:hover {
        background-color: #cdae21;
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
    const [errors, setErrors] = useState({
        email: undefined,
        password: undefined,
    });
    const { setHaveAccount, setLoginMethod, nativeSignIn } =
        useContext(AuthContext);
    const [signInForm, setSignInForm] = useState({
        provider: "native",
        email: "",
        password: "",
    });

    const handleSignInChange = (event) => {
        const key = event.target.name;

        const newError = { ...errors };

        if (key === "email") {
            // Validate email
            if (!validator.isEmail(event.target.value)) {
                newError.email = "Please enter a valid email address";
            } else {
                newError.email = undefined;
            }
        }
        if (key === "password") {
            // Validate password
            if (
                !validator.isStrongPassword(event.target.value, {
                    minLength: 8,
                    maxLength: 16,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                })
            ) {
                newError.password =
                    "Password must contain 1 uppercase letter, 1 lowercase letter, 1 number and 1 special symbol, and be 8-16 characters long";
            } else {
                newError.password = undefined;
            }
        }

        setErrors(newError);

        setSignInForm({ ...signInForm, [key]: event.target.value });
    };

    return (
        <>
            <LoginFormContainer
                onSubmit={(event) => {
                    event.preventDefault();
                    nativeSignIn(signInForm);
                }}
            >
                <WelcomeImage src="/assets/images/trip-pana.svg"></WelcomeImage>
                <LoginContentContainer>
                    <InputField
                        type="text"
                        name="email"
                        label="Email"
                        placeholder="(ex: splitease@splitease.com)"
                        value={signInForm.email}
                        onChange={handleSignInChange}
                        autoComplete="on"
                        required
                        variant="standard"
                        error={errors.email !== undefined}
                        helperText={errors.email}
                    />
                    <InputField
                        type="password"
                        name="password"
                        label="Password"
                        placeholder="Password"
                        value={signInForm.password}
                        onChange={handleSignInChange}
                        autoComplete="on"
                        required
                        variant="standard"
                        // helperText="1 uppercase, 1 lowercase, 1 digit, 1 special symbol"
                        error={errors.password !== undefined}
                        helperText={errors.password}
                    />
                    <LoginButton type="submit">Login</LoginButton>
                </LoginContentContainer>

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
