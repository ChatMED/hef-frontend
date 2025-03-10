import '../App.css';
import {createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider} from "react-router-dom";
import {ModelEvaluationPage} from "./model-evaluation/page.jsx";
import {RootLayout} from "@/pages/root-layout.jsx";
import {ThankYouPage} from "@/pages/thank-you/page.jsx";
import {LoginPage} from "@/pages/login/page.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<RootLayout/>}>
            <Route path="question" element={<ModelEvaluationPage/>}/>
            <Route path="thank-you" element={<ThankYouPage/>}/>
            <Route path="login" element={<LoginPage/>}/>

            <Route path="*" element={<Navigate to={"question"}/>}/>
        </Route>
    )
);

export const RootRouterProvider = () => <RouterProvider router={router}/>;