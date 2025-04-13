import {createContext, useContext, useEffect, useReducer, useState} from "react";
import {useAuthContext} from "@/context/auth-context.jsx";
import axios from "@/axios/axios.js";
import {LoadingComponent} from "@/pages/loading-screen/loadingComponent.jsx";
import {getQuestionForEvaluation} from "@/services/questions.js";

const AppContext = createContext({})

const reducer = (state, action) => {
    return {...state, ...action}
};

export const AppContextProvider = ({children}) => {
    const {user} = useAuthContext();
    const [state, dispatch] = useReducer(reducer);

    useEffect(() => {
        /*setLoading(true);
        getQuestionForEvaluation(null)
            .then(questionResponse => {
                dispatch({
                    currentQuestionForEvaluation: questionResponse?.data || {}
                });
            })
            .catch(error => {
                console.log(error)
                dispatch({currentQuestionForEvaluation: {}})
            })
            .finally(() => setLoading(false))

        axios.get('api/models')
            .then(modelsResponse => {
                dispatch({models: modelsResponse?.data});
            }).catch(error => console.log(error))*/

    }, [user])

    return (
        <AppContext.Provider
            value={{state, dispatch}}
        >
            {children}
        </AppContext.Provider>

    )
}

export const useAppContext = () => useContext(AppContext);
