import React, {useState, useEffect} from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormComponent from "./Components/FormComponent/FormComponent";
import UsersTableComponent from "./Components/UsersTableComponent/UsersTableComponent";
import UserLoginHistoryComponent from "./Components/UserLoginHistoryComponent/UserLoginHistoryComponent";
import AccessDeniedComponent from "./Components/AccessDeniedComponent/AccessDeniedComponent"

function App() {
    const [loginStatus, setLoginStatus] = useState(false);

    async function changeLoggedInStatus (currentState) {
        await setLoginStatus(currentState)
    }

    useEffect( () => {
    }, [loginStatus]);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<FormComponent
                            title={"Login"}
                            buttonText={"Log in"}
                            forgotPWLink={false}
                            loggedInStatus={changeLoggedInStatus}
                        />}
                    />
                    <Route
                        path="/login"
                        element={<FormComponent
                            title={"Login"}
                            buttonText={"Log in"}
                            forgotPWLink={false}
                            loggedInStatus={changeLoggedInStatus}
                        />}
                    />
                    <Route
                        path="/users"
                        element={loginStatus ? <UsersTableComponent /> : <AccessDeniedComponent />}
                    />
                    <Route
                        path="/users/:id"
                        element={loginStatus ? <UserLoginHistoryComponent /> : <AccessDeniedComponent />}
                    />
                    <Route
                        path="/register"
                        element={<FormComponent
                            title={"Register"}
                            buttonText={"Register"}
                            forgotPWLink={false}
                        />}
                    />
                    <Route
                        path="/add-another-user"
                        element={loginStatus ?
                        <FormComponent
                            title={"Add another user"}
                            buttonText={"Submit"}
                            forgotPWLink={false}
                        /> : <AccessDeniedComponent />}
                    >
                    </Route>
                    <Route
                        path="/confirm-account"
                        element={<FormComponent
                            title={"Confirm account"}
                            buttonText={"Confirm"}
                            forgotPWLink={false}
                        />}
                    />
                    <Route
                        path="/forgot-password"
                        element={<FormComponent
                            title={"Forgot password"}
                            buttonText={"Send new password"}
                            forgotPWLink={true}
                        />}
                    />
                    <Route
                        path="/access-denied"
                        element={<AccessDeniedComponent />}
                    />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App