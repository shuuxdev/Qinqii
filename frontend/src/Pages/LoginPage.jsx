import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import connection from "../Helper/SignalR.js";
import { asyncLogin } from "../Modules/User.js";

const LOGIN_INFO = {
    username: "",
    password: ""
}


const LoginPage = () => {
    const Username = useRef(LOGIN_INFO.username);
    const Password = useRef(LOGIN_INFO.password);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    async function Login() {
        let username = Username.current.value;
        let password = Password.current.value;
        var isAuthenticated = dispatch(asyncLogin({ username, password }))
            .then((user_id) => navigate('/'))
            .catch((e) => alert(e))

    }

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
            <img src="/img/beams.jpg" alt="" className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2" width="1308" />
            <div className="absolute inset-0  bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
                <div className="flex gap-[20px] flex-col" >
                    <input ref={Username} type="text" placeholder="Tên đăng nhập" className="rounded-[5px] p-[10px] shadow-md border-gray-100 border" />
                    <input ref={Password} type="text" placeholder="Mật khẩu" className="rounded-[5px] p-[10px] shadow-md border-gray-100 border" />
                    <button type="submit" onClick={() => Login()} className="outline-none border-none text-[white] bg-blue-400 p-[5px] rounded-[5px]">ĐĂNG NHẬP</button>
                    <button type="submit" className="outline-none border-none text-[white] bg-green-400 p-[5px] rounded-[5px]">ĐĂNG KÝ</button>
                </div>
            </div>
        </div>

    )
}
export default LoginPage