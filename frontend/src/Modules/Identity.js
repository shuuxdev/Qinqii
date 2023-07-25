import jwtDecode from 'jwt-decode'
import Cookies from 'react-cookie/cjs/Cookies.js'
import { POST_Login } from '../Helper/Axios.js'

// export const USER_AUTHENTICATE =
//   "user/authenticate";
export const USER_DATA_LOADING = 'USER_DATA_LOADING'
export const USER_DATA_SUCCESS = 'USER_DATA_SUCCESS'
export const USER_DATA_ERROR = 'USER_DATA_ERROR'
// export const authenticate = () => ({
//   type: USER_AUTHENTICATE,
// });
const def = {
  claims: null,
  loading: false,
  error: null
}

const Reducer = (state = def, action) => {
  switch (action.type) {
    // case USER_AUTHENTICATE:
    //   return {
    //     id: action.payload.sub,
    //   };
    case USER_DATA_LOADING:
      return {
        loading: true,
        claims: null,
        error: null
      }
    case USER_DATA_SUCCESS:
      return {
        loading: false,
        claims: action.payload,
        error: null
      }
    case USER_DATA_ERROR:
      return {
        loading: false,
        claims: null,
        error: action.payload
      }
    default:
      return state
  }
}

export const asyncLogin = (loginInfo) => async (dispatch, getState) => {
  dispatch({ type: USER_DATA_LOADING })
  try {
    const res = await POST_Login(loginInfo)
    if (res.status === 200) {
      const cookies = new Cookies()
      var jwt_payload = jwtDecode(cookies.get('Token'))
      dispatch({
        type: USER_DATA_SUCCESS,
        payload: jwt_payload
      })
      console.log(getState().identity.claims)
    }
  } catch (e) {
    dispatch({
      type: USER_DATA_ERROR,
      payload: e
    })
  }
  return new Promise((resolve, reject) => {
    let claims = getState().identity.claims
    if (claims) {
      resolve(claims.sub)
    } else reject(0)
  })
}
export default Reducer
