import '../../App.css';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
    RouterProvider
} from "react-router-dom";
import {ModelEvaluationPage} from "../model-evaluation/page.jsx";
import {LoginPage} from "@/pages/login/page.jsx";
import {ThankYouPage} from "@/pages/thank-you/page.jsx";
import ProtectedRoute from "@/pages/routing/protected-route.jsx";
import {useAuthContext} from "@/context/auth-context.jsx";

export const RootRouterProvider = () => {
    const {isAuth} = useAuthContext();

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route
                    path="question"
                    element={
                        <ProtectedRoute>
                            <ModelEvaluationPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="thank-you"
                    element={
                        <ProtectedRoute>
                            <ThankYouPage/>
                        </ProtectedRoute>
                    }
                />
                <Route path="login" element={<LoginPage/>}/>
                <Route path="*" element={<Navigate to={isAuth ? "/question" : "/login"} replace/>}/>
            </Route>
        )
    );

    return <RouterProvider router={router}/>;
};
