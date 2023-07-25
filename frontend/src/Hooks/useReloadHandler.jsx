import jwt_decode from "jwt-decode";
import Cookies from 'react-cookie/cjs/Cookies.js';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export const useReloadHandler = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();



    const reloadHandler = () => {
        const cookie = new Cookies();
        try {
            let user = jwt_decode(
                cookie.get('Token')
            );
            if (user) {
                // dispatch(authenticate())
            } else throw new Error();
        } catch (e) {
            navigate("/login");
        }
    };
    return reloadHandler;
};
