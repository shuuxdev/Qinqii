import { POST_NotificationMarkAsRead } from '../Helper/Axios';

const { createSlice } = require("@reduxjs/toolkit");



const notificationSlice = createSlice({ 
    
    initialState: [],
    name: 'notification',   
    reducers: {
        addNotification: (state, action) => {
            state.push(action.payload)
        },
        removeNotification: (state, action) => {
            return state.filter((notification) => notification.id !== action.payload)
        },
        markAsRead: (state, action) => { 
            const notification = state.find((notification) => notification.id === action.payload)
            if (notification) {
                notification.read = true
            }
        },
        fetchNotifications: (state, action) => {
            return action.payload
        }
    }
})

export const markAsReadThunk =  (id) => async (dispatch, getState) => {
    const notification = getState().notifications.find((notification) => notification.id === id)
    if (notification && !notification.read) {
        const [statusCode, error ]=  await POST_NotificationMarkAsRead(id);
        if (statusCode === 200)
        dispatch(markAsRead(id))
    }
}

export const { addNotification, removeNotification, markAsRead,fetchNotifications } = notificationSlice.actions
export default notificationSlice.reducer