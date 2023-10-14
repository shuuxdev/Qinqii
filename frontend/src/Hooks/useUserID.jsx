import Cookies from 'react-cookie/cjs/Cookies.js';
import jwtDecode from 'jwt-decode';

export const useUserID = () => {
    const cookies = new Cookies();
    const token = cookies.get('Token');
    if(!token) return null;
    const id = jwtDecode(token).sub;
    return parseInt(id);
}