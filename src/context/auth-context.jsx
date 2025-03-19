import {createContext, useContext, useEffect, useState} from "react";
import {LoadingScreen} from "@/components/loading-screen/LoadingScreen.jsx";
import {login} from "@/services/login.js";

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
        }).catch(() => {
            setIsAuth(false);
        });
    };

    const onLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setIsAuth(false);
    };

    return (
        <AuthContext.Provider value={{isAuth, user, onLogin, onLogout}}>
            {isAuth === null ? <LoadingScreen/> : children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
