import {useEffect, useMemo} from 'react'
import {ToastContainer} from "react-toastify";
import {ThemeProvider} from "@mui/material";
import {darkTheme, lightTheme} from "./theme.config.js";
import {useAtom} from "jotai";
import {RootRouterProvider} from "./pages/routing/router.jsx";
import {ThemeAtom} from "./atoms.js";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {AuthContextProvider} from "@/context/auth-context.jsx";
import {AppContextProvider} from "@/context/app-context.jsx";

function Providers() {
  const [selectedTheme, setSelectedTheme] = useAtom(ThemeAtom)

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      setSelectedTheme(theme)
    }
  }, [])

  const theme = useMemo(() => {
    if (selectedTheme === "light") {
      return lightTheme;
    }
    return darkTheme;
  }, [selectedTheme])

  return (
    <>
      <ToastContainer/>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ThemeProvider theme={theme}>
          <AuthContextProvider>
            <AppContextProvider>
              <RootRouterProvider/>
            </AppContextProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </>
  )
}

export default Providers
