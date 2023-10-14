import { DELETE_Notification, POST_NotificationMarkAsRead } from '../Helper/Axios';

const { createSlice } = require("@reduxjs/toolkit");



const notificationSlice = createSlice({ 
    
    initialState: [],
    name: 'notification',   
    reducers: {
        addNotification: (state, action) => {
            state.push(action.payload)
        },
        addNotifications: (state, action) => {
            state.push(...action.payload.filter((notification) => !state.find((n) => n.id === notification.id)))
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
export const deleteNotificationThunk =  (id, notify) => async (dispatch, getState) => {
    const [statusCode, error ]=  await DELETE_Notification(id);
    if (statusCode === 200)
     dispatch(removeNotification(id))
    else {
        notify.open({
            message: 'Lỗi: ' + error.response.data.Message,
            type: 'error',
            duration: 10,
            placement: 'topLeft'
        })
    }

}

export const { addNotification,addNotifications, removeNotification, markAsRead,fetchNotifications } = notificationSlice.actions
export default notificationSlice.reducer