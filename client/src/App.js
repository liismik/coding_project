import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormComponent from "./Components/FormComponent/FormComponent";
import UsersTableComponent from "./Components/UsersTableComponent/UsersTableComponent";
import UserLoginHistoryComponent from "./Components/UserLoginHistoryComponent/UserLoginHistoryComponent";
import AccessDeniedComponent from "./Components/AccessDeniedComponent/AccessDeniedComponent"

function App() {
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
                        />}
                    />
                    <Route
                        path="/login"
                        element={<FormComponent
                            title={"Login"}
                            buttonText={"Log in"}
                            forgotPWLink={false}
                        />}
                    />
                    <Route
                        path="/users"
                        element={<UsersTableComponent />}
                    />
                    <Route
                        path="/users/:id"
                        element={<UserLoginHistoryComponent />}
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
                        element={<FormComponent
                            title={"Add another user"}
                            buttonText={"Submit"}
                            forgotPWLink={false}
                        />}
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