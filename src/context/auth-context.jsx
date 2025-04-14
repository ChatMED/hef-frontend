import {createContext, useContext, useEffect, useState} from "react";
import {LoadingComponent} from "@/pages/loading-screen/loadingComponent.jsx";
import {login} from "@/services/login.js";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext({
    user: null,
    isAuth: null,
    onLogin: () => {
    },
    onLogout: () => {
    },
});

export const AuthContextProvider = ({children}) => {
    const [isAuth, setIsAuth] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(savedUser);
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, []);

    const onLogin = (username) => {
        login(username).then(response => {
            localStorage.setItem("user", response.username);
            setUser(response.username);
            setIsAuth(true);
            window.location.href = "/workspaces";
        }).catch(() => {
            setIsAuth(false);
        });
    };

    const onLogout = () => {
        localStorage.clear();
        setUser(null);
        setIsAuth(false);
    };

    return (
        <AuthContext.Provider value={{isAuth, user, onLogin, onLogout}}>
            {isAuth === null ? <LoadingComponent/> : children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
