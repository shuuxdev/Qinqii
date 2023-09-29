import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GET_Messages, POST_SendMessage } from '../Helper/Axios.js'



const chatSlice = createSlice({
  name: 'chat',
  initialState: [],
  reducers: {
    sendMessage: (state, action) => {
      return [...state.map((item) => {
        if(item.conversation_id == action.payload.conversation_id)
        {
          return {...item, messages: [ action.payload,...item.messages]}
        }
        return item;
      })]
    },
    openChat: (state, action) => {
      return [...state.filter((chat) => chat.conversation_id != action.payload.conversation_id), action.payload]
    },
    closeChat: (state, action) => {
      return state.filter((item) => item.conversation_id != action.payload)
    }
  }
})



export const fetchMessageAsync = (conversation_id) => async (dispatch, getState) => {
  const response = await GET_Messages(conversation_id)
  return new Promise((resolve, reject) => {
    console.log(response.data)
    if (response.status == 200 && response.data) resolve(response.data)
    reject(new Error('Không gửi được tin nhắn'))
  })
}
export const sendMessageAsync = (message, images, videos, thumbnails) => async (dispatch, getState) => {
  console.log(videos)
  console.log(thumbnails)
  const response = (await POST_SendMessage(message, images, videos, thumbnails))
}

export const { sendMessage, openChat, closeChat } = chatSlice.actions
export default chatSlice.reducer