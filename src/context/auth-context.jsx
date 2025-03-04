import {createContext, useContext, useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import {LoadingScreen} from "@/components/loading-screen/LoadingScreen.jsx";

const AuthContext = createContext({
  user: null,
})

export const AuthContextProvider = ({children}) => {
  const [isAuth, setIsAuth] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(user);
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [])

  const onLogin = (username) => {
    setUser(username);
    setIsAuth(true);
    localStorage.setItem("user", username)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        user,
        onLogin
      }}
    >
      {isAuth === null ? <LoadingScreen/> : children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext);