import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FormComponent.css";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {default as axios} from "axios";

toast.configure();

function FormComponent(props) {
    const navigate = useNavigate();
    const { title, buttonText, forgotPWLink } = props;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function userAction(api, values, navigateTo){
        await axios.post(api, values, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            }})
            .then((response) => {
                toast.success(response, {position: "top-center", toastId: 'success-toast'});
                if(title === 'Login' && response.data.auth){
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("email", values.email);
                    props.loggedInStatus(true);
                }
                navigate(navigateTo);
            })
            .catch((err) => {
                toast.error(err.response.data.message, {position: "top-center", toastId: 'toast-error'});
            })
    }

    async function handleSubmit(event) {
        event.preventDefault();
        switch (title) {
            case "Login":
                await userAction("/app/login", {email, password}, "/users");
                return
            case "Register":
                await userAction("/app/register", {email, password, sendEmail: false}, "/login");
                return
            case "Forgot password":
                await userAction('/app/forgot-password', {email, password, sendEmail: false, isTest: false}, '/login');
                return
            case "Confirm account":
                await userAction("/app/confirm-account", {email, password}, "/login");
                return
            case "Add another user":
                await userAction("/app/register", {email, password, sendEmail: false}, "/users");
        }
    }

    return (
        <div>
            {((title !== "Register") && (title !== "Forgot password") && (title !== "Add another user"))
                ? (
                    <Link to="/register" className="linkedButton">
                        <button>Register</button>
                    </Link>
                ) : ((title !== "Login") && (title !== "Confirm account") && (title !== "Add another user")) ? (
                    <Link to="/login" className="linkedButton">
                        <button>Login</button>
                    </Link>
                ) : (title === "Add another user") ? (
                    <Link to="/users" className="linkedButton">
                        <button>Users</button>
                    </Link>
                )
                : null
            }
            <h1 className="title">{title}</h1>
            <div className="formContainer">
                <form onSubmit={handleSubmit} className="form">
                    <div>
                        <label>Email</label>
                        <br />
                        <input
                            aria-label='email-input'
                            className="input"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email address"
                            type="email"
                            name="email"
                            required
                        />
                    </div>
                    {(!forgotPWLink)
                        ? (
                            <div>
                                <label>Password</label>
                                <br />
                                <input
                                    aria-label='password-input'
                                    className="input"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Password"
                                    type="password"
                                    name="password"
                                    required
                                />
                            </div>
                        ) : null
                    }
                    {((title === "Login"))
                        ? (
                            <Link to="/forgot-password" className="forgotPassword">Forgot password?</Link>
                        )
                        : null
                    }
                    <div className="submitButtonContainer">
                        <button
                            type="submit"
                            className="submitButton"
                        >
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FormComponent