import { PATCH_FriendStatus } from '../Helper/Axios.js'

const friendRequestsReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_FRIEND_REQUESTS:
      return action.payload
    case ACCEPT:
      return [...state.filter((item) => item.id != action.payload.id)]
    case REJECT:
      return [...state.filter((item) => item.id != action.payload.id)]
    default:
      return state
  }
}

export const REJECT = 'REJECTED'
export const ACCEPT = 'ACCEPTED'
export const FETCH_FRIEND_REQUESTS = 'FETCH_FRIEND_REQUESTS'

export const fetchFriendRequestsAction = (arg) => ({ type: FETCH_FRIEND_REQUESTS, payload: arg })

export const updateFriendStatusAsync = (friendStatus) => async (dispatch, getState) => {
  const response = await PATCH_FriendStatus(friendStatus)
  if (response.status === 200) {
    if (friendStatus.action === ACCEPT) dispatch(acceptAction(friendStatus.id))
    else if (friendStatus.action === REJECT) dispatch(rejectAction(friendStatus.id))
  }
}

export const acceptAction = (id) => ({ type: ACCEPT, payload: { id } })
export const rejectAction = (id) => ({ type: REJECT, payload: { id } })

export default friendRequestsReducer
