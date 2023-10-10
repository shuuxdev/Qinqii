import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { asyncLogin, asyncRegister } from '../Reducers/User.js';
import { Form, Input } from 'antd';
import { AntdNotificationContext } from '../App';
import Color from '../Enums/Color';
const LOGIN_INFO = {
    email: '',
    password: '',
};

const Tab = {
    Login: 'Login',
    Register: 'Register'
}
const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(Tab.Login)
    const notify = useContext(AntdNotificationContext)
    async function Login(values) {
        let email = values.email;
        let password = values.password;
        dispatch(asyncLogin({ email, password }))
            .then((user_id) => {

                navigate('/')
                notify.open({
                    message: 'Đăng nhập thành công',
                    type: 'success',
                    placement: 'bottomLeft',
                    duration: 5
                });
            })
            .catch((e) => {
                notify.open({
                    message: 'Đăng nhập thất bại',
                    type: 'error',
                    placement: 'bottomLeft',
                    duration: 5
                });
            });
    }
    const Register = (values) => {
        let email = values.email;
        let password = values.password;
        let name = values.name;
        dispatch(asyncRegister({ email, password,name }))
            .then(([statusCode, error]) => {
                console.log(statusCode);
                if(statusCode === 200)
                {
                    notify.open({
                        message: 'Đăng ký thành công' ,
                        type: 'success',
                        placement: 'bottomLeft',
                        duration: 5
                    });
                    setActiveTab(Tab.Login);
                }
                if(statusCode === 409) {
                    notify.open({
                        message: 'Đăng ký thất bại: ' + error.response.data.Message,
                        type: 'error',
                        placement: 'bottomLeft',
                        duration: 5
                    });
                }
                if(statusCode === 400)
                {
                    console.log(error.response.data.errors.name);
                    Object.keys(error.response.data.errors).forEach((key) => {
                        notify.open({
                            message: 'Đăng ký thất bại: ' + error.response.data.errors[key],
                            type: 'error',
                            placement: 'bottomLeft',
                            duration: 30
                        });
                    })

                }
            })
    }

    return (
        <div className='relative flex min-h-screen  flex-col justify-center  bg-gray-50 py-6 sm:py-12'>
            <div
                className='rounded-[20px] overflow-hidden relative bg-white shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg'>
                <div className='flex gap-[20px] flex-col'>
                    {/* <input ref={Email} type="text" placeholder="Tên đăng nhập" className="rounded-[5px] p-[10px] shadow-md border-gray-100 border" />
                    <input ref={Password} type="text" placeholder="Mật khẩu" className="rounded-[5px] p-[10px] shadow-md border-gray-100 border" />*/}
                    <div className='flex cursor-pointer border-b-blue-100 border-solid border-[1px] h-[70px] w-full'>
                        <div style={{borderBottom: activeTab === Tab.Login ? '1px solid blue' : ''}}  onClick={() => setActiveTab(Tab.Login)} className={`flex justify-center items-center flex-1 hover:bg-[${Color.Hover}]`}>
                            Đăng nhập
                        </div>
                        <div style={{borderBottom: activeTab === Tab.Register ? '1px solid blue' : ''}}  onClick={() => setActiveTab(Tab.Register)} className={`flex justify-center items-center flex-1 hover:bg-[${Color.Hover}]`}>
                            Đăng kí
                        </div>
                    </div>
                    {
                        activeTab === Tab.Login &&
                        <div className='p-10'>
                            <Form
                                name='basic'
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ maxWidth: 600 }}
                                autoComplete='off'
                                onFinish={Login}
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
                                    label='Mật khẩu'
                                    name='password'
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>



                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <button type='submit'
                                            className='outline-none w-full border-none text-[white] bg-blue-400 p-[5px] rounded-[5px]'>ĐĂNG NHẬP
                                    </button>
                                </Form.Item>



                            </Form>
                        </div>
                    }
                    {
                        activeTab === Tab.Register &&
                        <div className='p-10'>
                            <Form
                                name='basic'
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ maxWidth: 600 }}
                                autoComplete='off'
                                onFinish={Register}
                            >
                                <Form.Item
                                    label='Email'
                                    name='email'
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'Email không đúng định dạng',
                                        },
                                        {
                                            required: true,
                                            message: 'Thiếu email bạn ưi',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label='Mật khẩu'
                                    name='password'
                                    rules={[{ required: true, message: 'Nhập mật khẩu nữa nha' }]}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                    label='Tên hiển thị'
                                    name='name'
                                    rules={[{ required: true, message: 'Nhập thêm tên để hiển thị nữa' }]}
                                >
                                    <Input/>
                                </Form.Item>


                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>

                                    <button type='submit'
                                            className='outline-none w-full border-none text-[white] bg-green-400 p-[5px] rounded-[5px]'>ĐĂNG KÝ
                                    </button>
                                </Form.Item>


                            </Form>
                        </div>
                    }

                    {/*<GoogleSignInButton />*/}

                </div>
            </div>
        </div>

    );
};
export default LoginPage;