import { createSlice } from '@reduxjs/toolkit';
import { GET_Messages, POST_MarkAsRead, POST_SendMessage } from '../Helper/Axios.js';


const chatSlice = createSlice({
  name: 'chat',
  initialState: [],
  reducers: {
    openChat: (state, action) => {
      let exist = state.find((id) => id === action.payload)
        if (!exist) {
            state.push(action.payload)
        }
    },
    closeChat: (state, action) => {
      return state.filter((id) => id !== action.payload)
    }
  }
})



export const sendMessageAsync = (message, images, videos, thumbnails, notify) => async (dispatch, getState) => {
  const [statusCode, error] = (await POST_SendMessage(message, images, videos, thumbnails))
  if(statusCode !== 200)
  {
    notify.open({
        message: 'Lỗi: ' + error.response.data.Message,
        type: 'error',
        duration: 5,
        placement: 'bottomLeft'
    })
  }
}



export const { openChat, closeChat } = chatSlice.actions
export default chatSlice.reducer