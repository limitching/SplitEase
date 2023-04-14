import { createContext, useState } from "react";

const AuthContext = createContext({
    isLogin: false,
    user: {},
    loading: false,
    jwtToken: "",
});

const AuthContextProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [jwtToken, setJwtToken] = useState();

    return (
        <AuthContext.Provider
            value={{
                isLogin,
                user,
                loading,
                jwtToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };
