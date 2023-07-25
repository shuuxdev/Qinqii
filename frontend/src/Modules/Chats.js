import { GET_Messages, POST_SendMessage } from '../Helper/Axios.js'

//==========================[REDUCER]==============================
 const Reducer = (state = [], action) => {
  switch (action.type) {
    case CLOSE_CHAT:
      return state.filter((item) => item.conversation_id != action.payload.conversation_id)
    case OPEN_CHAT:
      return [...state.filter((chat) => chat.conversation_id != action.payload.conversation_id), action.payload]
    case SEND_MESSAGE:
      return [...state.map((item) => {
        if(item.conversation_id == action.payload.conversation_id)
        {
          return {...item, messages: [...item.messages, action.payload]}
        }
        return item;
      })]
    default:
      return state
  }
}

//==========================^^^^^^^^===============================

//==========================[ACTION]==============================
export const CLOSE_CHAT = 'chat/close'
export const OPEN_CHAT = 'chat/open'
export const SEND_MESSAGE = 'chat/send-message'

//================================================================

//==========================[ACTION CREATOR]==============================

export const sendMessage = (message_info) => ({type: SEND_MESSAGE, payload: message_info})
export const openChat = (conversation_info) => ({
  type: OPEN_CHAT,
  payload: conversation_info
})
export const closeChat = (conversation_id) => ({
  type: CLOSE_CHAT,
  payload: { conversation_id }
})

export const fetchMessageAsync = (conversation_id) => async (dispatch, getState) => {
  const response = await GET_Messages(conversation_id)
  return new Promise((resolve, reject) => {
    console.log(response.data)
    if (response.status == 200 && response.data) resolve(response.data)
    reject(new Error('Không gửi được tin nhắn'))
  })
}
//==============================^^^^^^^^=================================

//==========================[THUNK]==============================
export const sendMessageAsync = (message_info) => async (dispatch, getState) => {
  const response = (await POST_SendMessage(message_info))
}
//================================================================
export default Reducer