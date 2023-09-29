import { createSlice } from '@reduxjs/toolkit'
import { PATCH_FriendStatus, POST_SendFriendRequest } from '../Helper/Axios.js'



const friendRequestSlice = createSlice({
  name: 'friendRequests',
  initialState: [],
  reducers: {
    fetchFriendRequests: (state, action) => {
      return action.payload
    },
    updateFriendStatus: (state, action) => {
        return [...state.filter((item) => item.id != action.payload)]
    },
    addFriendRequest: (state, action) => {
        state.push(action.payload)
    }
  }
})

export const REJECT = 'REJECTED'
export const ACCEPT = 'ACCEPTED'
export const FETCH_FRIEND_REQUESTS = 'FETCH_FRIEND_REQUESTS'


export const sendFriendRequestThunk = (friendStatus) => async (dispatch, getState) => {
  await POST_SendFriendRequest(friendStatus)
}

export const updateFriendStatusAsync = (friendStatus) => async (dispatch, getState) => {
  const response = await PATCH_FriendStatus(friendStatus)
  const updateFriendStatus = friendRequestSlice.actions.updateFriendStatus;
  if (response.status === 200) {
     dispatch(updateFriendStatus(friendStatus.id))
  }
}

export const { fetchFriendRequests, addFriendRequest } = friendRequestSlice.actions
export default friendRequestSlice.reducer
