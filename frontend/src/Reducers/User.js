import jwtDecode from 'jwt-decode'
import Cookies from 'react-cookie/cjs/Cookies.js'
import { GET_UserProfile, POST_Login } from '../Helper/Axios.js';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';



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
    const res = await POST_Login(loginInfo)
    if (res.status === 200) {
      const cookies = new Cookies()
      var jwt_payload = jwtDecode(cookies.get('Token'))
      dispatch(userSlice.actions.authenticate(jwt_payload))
    }
    let id = getState().user.user_id
    if (id) {
      return id;
    }
     else throw new Error('Đăng nhập thất bại')
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
