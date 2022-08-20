import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";
import "./FormComponent.css";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {default as axios} from "axios";

toast.configure();

function FormComponent(props) {
    const navigate = useNavigate();
    const { title, buttonText, forgotPWLink } = props;

    async function userAction(api, values, navigateTo){
        await axios.post(api, values, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            }})
            .then((response) => {
                toast.success(response, {position: "top-center"});
                if(title === 'Login' && response.data.auth){
                    localStorage.setItem("token", response.data.token);
                    props.loggedInStatus(true);
                }
                navigate(navigateTo);
            })
            .catch((err) => {
                toast.error(err.response.data.message, {position: "top-center"});
            })
    }

    const onFinish = async (values: any) => {
        switch (title) {
            case "Login":
                await userAction("/app/login", values, "/users");
                return
            case "Register":
                await userAction("/app/register", values, "/login");
                return
            case "Forgot password":
                await userAction('/app/forgot-password', values, '/login');
                return
            case "Confirm account":
                await userAction("/app/confirm-account", values, "/login");
                return
            case "Add another user":
                await userAction("/app/register", values, "/users");
        }
    }

    const onFinishFailed = () => {
        toast.error("Something went wrong...");
    }

    return (
        <div>
            {((title !== "Register") && (title !== "Forgot password"))
                ? (
                    <Button type="primary">
                        <Link to="/register">Register</Link>
                    </Button>
                ) : ((title !== "Login") && (title !== "Confirm account")) ? (
                    <Button type="primary">
                        <Link to="/login">Login</Link>
                    </Button>
                )
                : null
            }
            <h1 className="title">{title}</h1>
            <div className="formContainer">
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please input your email!" }]}
                    >
                        <Input />
                    </Form.Item>
                    {(!forgotPWLink)
                        ? (
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{required: true, message: "Please input your password!"}]}
                            >
                                <Input.Password/>
                            </Form.Item>
                        )
                        : null
                    }
                    {((title === "Login"))
                        ? (
                            <Link to="/forgot-password" className="forgotPassword">Forgot password</Link>
                        )
                        : null
                    }
                    <Form.Item className="submitButtonContainer" wrapperCol={{ offset: 8, span: 16 }}>
                        <Button className="submitButton" type="primary" htmlType="submit">
                            {buttonText}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default FormComponent