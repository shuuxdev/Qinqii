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

export const { addNotification, removeNotification, markAsRead,fetchNotifications } = notificationSlice.actions
export default notificationSlice.reducer