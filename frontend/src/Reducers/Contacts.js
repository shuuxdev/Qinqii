import { DELETE_Message, POST_MarkAsRead, SEND_React } from '../Helper/Axios';

const { createSlice } = require('@reduxjs/toolkit');


export const FETCH_CONTACTS = 'FETCH_CONTACTS';


const contactSlice = createSlice({
    initialState: [],
    name: 'contacts',
    reducers: {
        updateOnlineStatus: (state, action) => {
            state.forEach((contact) => {
                if (contact.recipient_id === action.payload.user_id) {
                    contact.online_status = action.payload.status;
                }
            });
        },
        updateUnreadMessageCount: (state, action) => {
            state.forEach((contact) => {
                if (contact.conversation_id === action.payload.conversation_id) {
                    contact.unread_messages = action.payload.unread_message_count;
                }
            });
        },
        increaseUnreadMessageCount: (state, action) => {
            state.forEach((contact) => {
                if (contact.conversation_id === action.payload) {
                    contact.unread_messages++;
                }
            });
        },
        addContact: (state, action) => {
            let exist = state.find((contact) => contact.conversation_id === action.payload.conversation_id);
            if (!exist) {
                state.push(action.payload);
            }
        },
        fetchContacts: (state, action) => {
            return action.payload;
        },
        sendMessage: (state, action) => {
            return [...state.map((item) => {
                if (item.conversation_id === action.payload.conversation_id) {
                    return {
                        ...item,
                        last_message: action.payload.message_text,
                        last_message_sender_id: action.payload.sender_id,
                        last_message_sent_at: action.payload.sent_at,
                        messages: [action.payload, ...item.messages],
                    };
                }
                return item;
            })];
        },
        updateMessage: (state, action) => {
            return [...state.map((item) => {
                if (item.conversation_id === action.payload.conversation_id) {
                    return {
                        ...item,
                        messages: item.messages.map((message) => {
                            if (message.id === action.payload.id) {
                                return action.payload;
                            }
                            return message;
                        }),
                    };
                }
                return item;
            })];
        },
        openChat: (state, action) => {
            return [...state.filter((chat) => chat.conversation_id !== action.payload.conversation_id), action.payload];
        },
        closeChat: (state, action) => {
            return state.filter((item) => item.conversation_id !== action.payload);
        },
    },
});

export const markAsReadAsync = (conversation_id) => async (dispatch, getState) => {
    const [statusCode, error] = await POST_MarkAsRead(conversation_id);

    if (statusCode !== 200) throw new Error('Không thể đánh dấu đã đọc');
    dispatch(updateUnreadMessageCount({ conversation_id, unread_message_count: 0 }));
};
export const reactToMessageAsync = (message, ra) => async (dispatch, getState) => {
    let [reaction, err] = await SEND_React(ra);
    if (!err) {
        dispatch(updateMessage({
            conversation_id: message.conversation_id,
            ...message,
            reactions: [...message.reactions, reaction],
        }));
    }
};
export const deleteMessageAsync = (message) => async (dispatch, getState) => {
    const [statusCode, err] = await DELETE_Message(message.id);
    if (statusCode === 200) {
        dispatch(updateMessage({
            conversation_id: message.conversation_id,
            ...message,
            deleted: true,
        }));
    }
}
export const {
    addContact,
    updateMessage,
    sendMessage,
    increaseUnreadMessageCount,
    updateUnreadMessageCount,
    updateOnlineStatus,
    fetchContacts,
} = contactSlice.actions;
export default contactSlice.reducer;
