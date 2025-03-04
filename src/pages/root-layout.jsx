import {Outlet, useNavigate} from "react-router-dom";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'react-toastify/dist/ReactToastify.css';
import {useEffect} from "react";
import {useAuthContext} from "@/context/auth-context.jsx";

export const RootLayout = () => {
  const {isAuth} = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth !== null) {
      if (isAuth) {
        if (localStorage.getItem("attempt") && localStorage.getItem("question")) {
          navigate(`/question/${localStorage.getItem("question")}`);
        } else {
          navigate("/question")
        }
      } else {
        navigate("/login")
      }
    }
  }, [isAuth])

  return (
    <>
      <Outlet />
    </>
  )
}