import {createContext, useContext, useEffect, useReducer, useState} from "react";
import {useAuthContext} from "@/context/auth-context.jsx";
import axios from "@/axios/axios.js";
import {LoadingScreen} from "@/components/loading-screen/LoadingScreen.jsx";


const AppContext = createContext({})

const initialState = {
  responses: []
}

const reducer = (state, action) => {
  return {...state, ...action}
};

export const AppContextProvider = ({ children }) => {
  const {user} = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setLoading(true);
    axios.get("/api/questions")
      .then(response => {
        dispatch({responses: response.data || []});
        console.log(response.data);
      })
      .catch(error => console.log(error))
      .finally(() => setLoading(false))
  }, [user?.uid])

  return (
    <AppContext.Provider
      value={{state, dispatch}}
    >
      {loading ? <LoadingScreen /> : children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext);
