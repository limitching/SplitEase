import { useLiff } from "react-liff";
import { useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const Liff = () => {
    const { isLoggedIn, isReady, liff } = useLiff();
    const { isLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (isLogin) {
            navigate("/home");
        }
        if (isReady) {
            (function () {
                if (!isLoggedIn) {
                    liff.login({
                        scope: ["profile", "email"],
                    });
                }
            })();
        }
    }, [isReady, isLoggedIn, liff, isLogin, navigate]);

    return <div></div>;
};

export default Liff;
