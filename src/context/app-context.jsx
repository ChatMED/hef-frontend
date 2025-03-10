import {createContext, useContext, useEffect, useReducer, useState} from "react";
import {useAuthContext} from "@/context/auth-context.jsx";
import axios from "@/axios/axios.js";
import {LoadingScreen} from "@/components/loading-screen/LoadingScreen.jsx";

const AppContext = createContext({})

const reducer = (state, action) => {
    return {...state, ...action}
};

export const AppContextProvider = ({children}) => {
    const {user} = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [state, dispatch] = useReducer(reducer);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/questions/${user}`)
            .then(questionResponse => {
                dispatch({
                    currentQuestionForEvaluation: questionResponse.data || {}
                });
            })
            .catch(error => {
                console.log(error)
                dispatch({ currentQuestionForEvaluation: {} })
            })
            .finally(() => setLoading(false))

        axios.get('api/models')
            .then(modelsResponse => {
                dispatch({models: modelsResponse.data});
            }).catch(error => console.log(error))

    }, [user])

    return (
        <AppContext.Provider
            value={{state, dispatch}}
        >
            {loading ? <LoadingScreen/> : children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);
