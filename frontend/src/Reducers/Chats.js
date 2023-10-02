import { createSlice } from '@reduxjs/toolkit';
import { GET_Messages, POST_MarkAsRead, POST_SendMessage } from '../Helper/Axios.js';


const chatSlice = createSlice({
  name: 'chat',
  initialState: [],
  reducers: {
    openChat: (state, action) => {
      return [...state.filter((id) => id !== action.payload), action.payload]
    },
    closeChat: (state, action) => {
      return state.filter((id) => id !== action.payload)
    }
  }
})



export const fetchMessageAsync = (conversation_id) => async (dispatch, getState) => {
  const response = await GET_Messages(conversation_id)
  return new Promise((resolve, reject) => {
    console.log(response.data)
    if (response.status === 200 && response.data) resolve(response.data)
    reject(new Error('Không gửi được tin nhắn'))
  })
}
export const sendMessageAsync = (message, images, videos, thumbnails) => async (dispatch, getState) => {
  const response = (await POST_SendMessage(message, images, videos, thumbnails))
}


export const { openChat, closeChat } = chatSlice.actions
export default chatSlice.reducer