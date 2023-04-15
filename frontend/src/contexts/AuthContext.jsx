import { createContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const AuthContext = createContext({
    isLogin: false,
    user: {},
    loading: false,
    jwtToken: "",
    loginMethod: null,
    haveAccount: true,
    setLoginMethod: () => {},
    setHaveAccount: () => {},
    nativeSignUp: () => {},
    nativeSignIn: () => {},
    lineSignIn: () => {},
});

const AuthContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [jwtToken, setJwtToken] = useState();
    const [loginMethod, setLoginMethod] = useState(null);
    const [haveAccount, setHaveAccount] = useState(true);

    const handleSignUpResponse = useCallback(async (signUpForm) => {
        const { data } = await api.userSignUp(signUpForm);
        console.log("data", data);
        if (data.errors !== undefined || data.error !== undefined) {
            MySwal.fire({
                title: <p>Request Error</p>,
                html: (
                    <div>
                        {data.errors ? (
                            data.errors.map((error, index) => (
                                <p key={"error" + index}>{error.msg}</p>
                            ))
                        ) : (
                            <p>{data.error}</p>
                        )}
                    </div>
                ),
                icon: "error",
                timer: 2000,
                didOpen: () => {
                    MySwal.showLoading();
                },
            });
            return;
        }
        const { access_token: tokenFromServer, user: userData } = data;
        setUser(userData);
        setJwtToken(tokenFromServer);
        window.localStorage.setItem("jwtToken", tokenFromServer);
        setIsLogin(true);
        return tokenFromServer;
    }, []);

    const handleNativeLoginResponse = useCallback(async (signInForm) => {
        console.log(signInForm);
        const { data } = await api.userSignIn(signInForm);
        console.log("data", data);
        if (data.errors !== undefined || data.error !== undefined) {
            console.log("hi");
            MySwal.fire({
                title: <p>Request Error</p>,
                html: (
                    <div>
                        {data.errors ? (
                            data.errors.map((error, index) => (
                                <p key={"error" + index}>{error.msg}</p>
                            ))
                        ) : (
                            <p>{data.error}</p>
                        )}
                    </div>
                ),
                icon: "error",
                timer: 2000,
                didOpen: () => {
                    MySwal.showLoading();
                },
            });
            return;
        }
        const { access_token: tokenFromServer, user: userData } = data;
        setUser(userData);
        setJwtToken(tokenFromServer);
        window.localStorage.setItem("jwtToken", tokenFromServer);
        setIsLogin(true);
        return tokenFromServer;
    }, []);

    const handleLineSignInResponse = useCallback(async (code, state) => {
        const data = { provider: "line", code, state };
        const result = await api.userSignIn(data);
        if (result.status === 200) {
            MySwal.fire({
                title: <p>Login Successfully!</p>,
                icon: "success",
                timer: 1000,
                didOpen: () => {
                    MySwal.showLoading();
                },
            });
            const { access_token: tokenFromServer, user: userData } =
                result.data;
            setUser(userData);
            setJwtToken(tokenFromServer);
            window.localStorage.setItem("jwtToken", tokenFromServer);
            setIsLogin(true);
            return tokenFromServer;
        } else if (result.status === 400) {
            const { error } = result.data;
            MySwal.fire({
                title: <p>Server Side Error</p>,
                html: <p>{error}</p>,
                icon: "error",
                timer: 2000,
                didOpen: () => {
                    MySwal.showLoading();
                },
            });
        } else if (result.status === 500) {
            const { error } = result.data;
            MySwal.fire({
                title: <p>Server Side Error</p>,
                html: <p>{error}</p>,
                icon: "error",
                timer: 2000,
                didOpen: () => {
                    MySwal.showLoading();
                },
            });
        }
    }, []);

    const nativeSignUp = async (signUpForm) => {
        setLoading(true);
        navigate("login");
        const tokenFromServer = handleSignUpResponse(signUpForm);
        setLoading(false);
        return tokenFromServer;
    };

    const lineSignIn = async (code, state) => {
        setLoading(true);
        const tokenFromServer = handleLineSignInResponse(code, state);
        setLoading(false);
        return tokenFromServer;
    };

    const nativeSignIn = async (signInForm) => {
        setLoading(true);
        const tokenFromServer = handleNativeLoginResponse(signInForm);
        setLoading(false);
        return tokenFromServer;
    };

    return (
        <AuthContext.Provider
            value={{
                isLogin,
                user,
                loading,
                jwtToken,
                loginMethod,
                haveAccount,
                setLoginMethod,
                setHaveAccount,
                nativeSignUp,
                nativeSignIn,
                lineSignIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };
