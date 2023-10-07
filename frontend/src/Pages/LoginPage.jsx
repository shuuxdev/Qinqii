import React,
{ useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import connection from '../Helper/SignalR.js';
import { asyncLogin } from '../Reducers/User.js';
import { GoogleSignInButton } from '../Components/Common/Buttons/GoogleSignInButton';
import { LoginForm } from '../Components/Forms/LoginForm';
import { Button, Checkbox, Form, Input } from 'antd';

const LOGIN_INFO = {
    email: '',
    password: '',
};


const LoginPage = () => {
    const Email = useRef(LOGIN_INFO.email);
    const Password = useRef(LOGIN_INFO.password);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function Login() {
        let email = Email.current.value;
        let password = Password.current.value;
        var isAuthenticated = dispatch(asyncLogin({ email, password }))
            .then((user_id) => navigate('/'))
            .catch((e) => alert(e));

    }

    async function onFinish(values) {
        let email = values.email;
        let password = values.password;
        console.log(values);
        dispatch(asyncLogin({ email, password }))
            .then((user_id) => navigate('/'))
            .catch((e) => alert(e));
    }

    return (
        <div className='relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12'>
            <img src='/img/beams.jpg' alt=''
                 className='absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2' width='1308' />
            <div
                className='absolute inset-0  bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]'></div>
            <div
                className='relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10'>
                <div className='flex gap-[20px] flex-col'>
                    {/* <input ref={Email} type="text" placeholder="Tên đăng nhập" className="rounded-[5px] p-[10px] shadow-md border-gray-100 border" />
                    <input ref={Password} type="text" placeholder="Mật khẩu" className="rounded-[5px] p-[10px] shadow-md border-gray-100 border" />*/}
                    <Form
                        name='basic'
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        autoComplete='off'
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label='Email'
                            name='email'
                            rules={[
                                {
                                    type: 'email',
                                    message: 'Please enter a valid email address',
                                },
                                {
                                    required: true,
                                    message: 'Please enter your email address',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label='Password'
                            name='password'
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name='remember'
                            valuePropName='checked'
                            wrapperCol={{ offset: 8, span: 16 }}
                        >
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <button type='submit'
                                    className='outline-none w-full border-none text-[white] bg-blue-400 p-[5px] rounded-[5px]'>ĐĂNG NHẬP
                            </button>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>

                            <button type='submit'
                                    className='outline-none w-full border-none text-[white] bg-green-400 p-[5px] rounded-[5px]'>ĐĂNG KÝ
                            </button>
                        </Form.Item>


                    </Form>
                    <GoogleSignInButton />

                </div>
            </div>
        </div>

    );
};
export default LoginPage;