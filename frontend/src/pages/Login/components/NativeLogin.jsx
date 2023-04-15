import styled from "styled-components";

const WelcomeImage = styled.img`
    width: 200px;
    height: 160px;
`;

const LoginFormContainer = styled.div`
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

const NativeLogin = () => {
    return (
        <>
            <LoginFormContainer>
                <WelcomeImage src="/greeting.svg"></WelcomeImage>
                <InputField type="text" placeholder="Name" />
                <InputField type="text" placeholder="Email" />
                <InputField type="password" placeholder="Password" />
                <LoginButton>Login</LoginButton>
            </LoginFormContainer>
        </>
    );
};

export { NativeLogin };
