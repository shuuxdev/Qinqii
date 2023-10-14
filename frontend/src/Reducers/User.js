import jwtDecode from 'jwt-decode'
import Cookies from 'react-cookie/cjs/Cookies.js'
import { GET_UserProfile, POST_Login, POST_Register } from '../Helper/Axios.js';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ShowNotification } from './UI';
import { Severity } from '../Enums/FetchState';
import axios from 'axios';



const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    authenticate: (state, action) => {
      state.user_id = action.payload;
    },
      fetchUser: (state, action) => {
            return action.payload
      }
  },
    extraReducers: (builder) => {
         builder.addCase(fetchUserThunk.fulfilled, (state, action) => {
                return action.payload;
        });
    }
})

export const asyncLogin = (loginInfo) => async (dispatch, getState) => {
    const GetApiResponseAs = async (api, responseType)  => {

        try {
            const res = await api;
            if(responseType === "Data")
            {
                return [res.data, null]
            }
            else {
                return [res.status, null]
            }
        }
        catch (err)
        {
            if(responseType === "StatusCode")
                return [null, err]
            else return [err.response.status, err]
        }
    }
        const [statusCode, error] = await GetApiResponseAs(axios.post('/auth/login_jwt', loginInfo), "StatusCode");
        if (statusCode === 200) {
            const cookies = new Cookies()
            var jwt_payload = jwtDecode(cookies.get('Token'))
            dispatch(userSlice.actions.authenticate(jwt_payload))
        }
        if(error)
        error.response.data.Message = 'Sai tên đăng nhập hoặc mật khẩu';
        return [statusCode, error]

}
export const asyncRegister = (registerInfo) => async (dispatch, getState) => {
    const [statusCode, error] = await POST_Register(registerInfo)
    return [statusCode, error];
}
export const fetchUserThunk = createAsyncThunk(
    'user/fetchUser',
    async (id, thunkAPI) => {
        const cookies = new Cookies()
        var jwt_payload = jwtDecode(cookies.get('Token'))
        const [data, error] = await GET_UserProfile(jwt_payload.sub);
        return data;
    }
)

export default userSlice.reducer
export const { authenticate , fetchUser} = userSlice.actions
