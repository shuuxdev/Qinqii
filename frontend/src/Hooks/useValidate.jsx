import jwtDecode from "jwt-decode";
import Cookies from 'react-cookie/cjs/Cookies.js';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { USER_DATA_SUCCESS } from "../Modules/Identity.js";
export const useValidate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const validateToken = () => {
        const cookies = new Cookies()

        try {
            var jwt_payload = jwtDecode(cookies.get('Token'))
            console.log(jwt_payload)
            dispatch({
                type: USER_DATA_SUCCESS,
                payload: jwt_payload
            })
        } catch (e) {
            navigate('/login');
            cookies.remove('Token');
            throw new Error(e);
        }
    }
    return validateToken;

}