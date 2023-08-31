import jwtDecode from 'jwt-decode'
import Cookies from 'react-cookie/cjs/Cookies.js'
import { POST_Login } from '../Helper/Axios.js'
import { createSlice } from '@reduxjs/toolkit'



const userSlice = createSlice({
  name: 'identity',
  initialState: {},
  reducers: {
    authenticate: (state, action) => {
      return {
        id: action.payload.sub,
      };
    },
  }
})

export const asyncLogin = (loginInfo) => async (dispatch, getState) => {
    const res = await POST_Login(loginInfo)
    if (res.status === 200) {
      const cookies = new Cookies()
      var jwt_payload = jwtDecode(cookies.get('Token'))
      dispatch(userSlice.actions.authenticate(jwt_payload))
    }
    let id = getState().identity.id
    if (id) {
      return id;
    }
     else throw new Error('Đăng nhập thất bại')
}
export default userSlice.reducer
