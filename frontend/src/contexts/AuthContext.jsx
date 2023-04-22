import { createContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import Loading from "../components/Loading";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import liff from "@line/liff";
import { useLiff } from "react-liff";
const MySwal = withReactContent(Swal);

const AuthContext = createContext({
    isLogin: false,
    user: {},
    userGroups: [],
    loading: false,
    jwtToken: "",
    loginMethod: null,
    haveAccount: true,
    setLoginMethod: () => {},
    setHaveAccount: () => {},
    nativeSignUp: () => {},
    nativeSignIn: () => {},
    lineSignIn: () => {},
    logout: () => {},
    setLoading: () => {},
    setGroupChange: () => {},
    joinGroup: () => {},
});

const AuthContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [jwtToken, setJwtToken] = useState(
        window.localStorage.getItem("jwtToken")
    );
    const [loginMethod, setLoginMethod] = useState(null);
    const [haveAccount, setHaveAccount] = useState(true);
    const [userGroups, setUserGroups] = useState([]);
    const [groupChange, setGroupChange] = useState(false);
    const { isLoggedIn, liff, isReady } = useLiff();

    useEffect(() => {
        const checkAuthStatus = async () => {
            setLoading(true);
            if (window.localStorage.getItem("jwtToken") !== null) {
                const { data } = await api.getUserProfile(
                    window.localStorage.getItem("jwtToken")
                );

                if (data.error) {
                    window.localStorage.removeItem("jwtToken");
                    window.localStorage.removeItem("fortune");
                    setUser({});
                    setIsLogin(true);
                    setLoading(false);
                    return;
                }
                setUser(data);
                setIsLogin(true);
                setLoading(false);
            } else {
                window.localStorage.removeItem("jwtToken");
                window.localStorage.removeItem("fortune");
                setIsLogin(false);
                setLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (isLogin && window.localStorage.getItem("jwtToken")) {
            const fetchUserGroups = async () => {
                const { data } = await api.getUserGroups(
                    window.localStorage.getItem("jwtToken")
                );
                setUserGroups(data);
            };
            setLoading(true);
            fetchUserGroups();
            setLoading(false);
        }
    }, [isLogin]);

    useEffect(() => {
        if (groupChange && window.localStorage.getItem("jwtToken")) {
            const fetchUserGroups = async () => {
                const { data } = await api.getUserGroups(
                    window.localStorage.getItem("jwtToken")
                );
                console.log(data);
                setUserGroups(data);
            };
            setLoading(true);
            fetchUserGroups();
            setGroupChange(false);
            setLoading(false);
        }
    }, [groupChange]);

    useEffect(() => {
        if (isReady && isLoggedIn && isLogin === false) {
            const handleLIFFSignInResponse = async () => {
                try {
                    const profile = await liff.getDecodedIDToken();
                    const data = {
                        provider: "liff",
                        name: profile.name,
                        email: profile.email,
                        image: profile.picture,
                        line_id: profile.sub,
                    };
                    console.log("liff data", data);
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
                        const {
                            access_token: tokenFromServer,
                            user: userData,
                        } = result.data;
                        setUser(userData);
                        setJwtToken(tokenFromServer);
                        window.localStorage.setItem(
                            "jwtToken",
                            tokenFromServer
                        );
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
                } catch (error) {
                    console.error(error);
                }
            };
            handleLIFFSignInResponse();
        }
    }, [isLoggedIn, liff, isReady, isLogin]);

    const handleSignUpResponse = useCallback(async (signUpForm) => {
        const { data } = await api.userSignUp(signUpForm);
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
        const { data } = await api.userSignIn(signInForm);
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

    const handleJoinGroup = useCallback(
        async (slug, invitation_code, jwtToken) => {
            const response = await api.joinGroup(
                slug,
                invitation_code,
                jwtToken
            );
            if (response.status === 200) {
                MySwal.fire({
                    title: <p>Login Successfully!</p>,
                    icon: "success",
                    timer: 1000,
                    didOpen: () => {
                        MySwal.showLoading();
                    },
                });
                setGroupChange(true);
                return;
            } else if (response.status === 400) {
                const { error } = response.data;
                MySwal.fire({
                    title: <p>Server Side Error</p>,
                    html: <p>{error}</p>,
                    icon: "error",
                    timer: 2000,
                    didOpen: () => {
                        MySwal.showLoading();
                    },
                });
            } else if (response.status === 500) {
                const { error } = response.data;
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
        },
        []
    );

    const joinGroup = async (slug, invitation_code, jwtToken) => {
        setLoading(true);
        handleJoinGroup(slug, invitation_code, jwtToken);
        setLoading(false);
        // return navigate("home");
    };

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

    // const liffSignIn = async () => {
    //     setLoading(true);
    //     const tokenFromServer = handleLIFFSignInResponse();
    //     setLoading(false);
    //     return tokenFromServer;
    // };

    const nativeSignIn = async (signInForm) => {
        setLoading(true);
        const tokenFromServer = handleNativeLoginResponse(signInForm);
        setLoading(false);
        return tokenFromServer;
    };

    const logout = async () => {
        setLoading(true);
        await liff.logout();
        setIsLogin(false);
        setUser({});
        setJwtToken();
        window.localStorage.removeItem("jwtToken");
        MySwal.fire({
            title: <p>Logout</p>,
            html: <p>Logout Successfully</p>,
            icon: "success",
            timer: 1000,
            didOpen: () => {
                MySwal.showLoading();
            },
        });
        navigate("login");
        setLoading(false);
    };
    if (loading) {
        return <Loading />;
    }

    return (
        <AuthContext.Provider
            value={{
                isLogin,
                user,
                userGroups,
                loading,
                jwtToken,
                loginMethod,
                haveAccount,
                setLoginMethod,
                setHaveAccount,
                nativeSignUp,
                nativeSignIn,
                lineSignIn,
                logout,
                setLoading,
                setGroupChange,
                joinGroup,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };
