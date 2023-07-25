
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import Cookies from 'react-cookie/cjs/Cookies.js';
export const useAuthenticatedUser = () => {

    const [user, setUser] = useState();
    const cookie = new Cookies();

    useEffect(() => {
        debugger;
        let _user = jwt_decode(
            cookie.get('Token')
        );

        setUser({ ..._user, id: _user.sub });
    }, [cookie.get('Token')])
    return user;
}