import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import './FormComponent.css';
import {default as axios} from 'axios';

function FormComponent(props) {
    const navigate = useNavigate();
    const { title, buttonText, forgotPWLink } = props;

    async function userAction(api, values, navigateTo){
        await axios.post(api, values)
            .then((response) => {
                if(response){
                    message.info(response);
                    console.log('response', response);
                }
                navigate(navigateTo);
            })
            .catch((err) => {
                message.info(err.response.data);
            })
    }

    const onFinish = async (values: any) => {
        switch (title) {
            case 'Login':
                await userAction('/app/login', values, '/users');
                return
            case 'Register':
                await userAction('/app/register', values, '/login');
                return
            case 'Forgot password':
                await userAction('/app/forgot-password', values, '/login');
                return
            case 'Confirm account':
                await userAction('/app/confirm-account', values, '/login');
                return
            default:
                return
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Error', errorInfo)
    }

    return (
        <div>
            {((title !== 'Register') && (title !== 'Forgot password'))
                ? (
                    <Button type='primary'>
                        <Link to='/register'>Register</Link>
                    </Button>
                )
                : null
            }
            <h1 className='title'>{title}</h1>
            <div className='formComponentContainer'>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    {(!forgotPWLink)
                        ? (
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{required: true, message: 'Please input your password!'}]}
                            >
                                <Input.Password/>
                            </Form.Item>
                        )
                        : null
                    }
                    {((title === 'Login'))
                        ? (
                            <Link to='/forgot-password' className='forgotPassword'>Forgot password</Link>
                        )
                        : null
                    }
                    <Form.Item className="submitButtonContainer" wrapperCol={{ offset: 8, span: 16 }}>
                        <Button className="submitButton" type="primary" htmlType="submit">
                            {buttonText}
                        </Button>
                    </Form.Item>
                </Form>
                <div></div>
            </div>
        </div>
    )
}

export default FormComponent