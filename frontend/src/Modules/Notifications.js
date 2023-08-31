const { createSlice } = require("@reduxjs/toolkit");

const NotificationType = {
    LIKE: 'like',
    COMMENT: 'comment',
    FOLLOW: 'follow',
    MENTION: 'mention',
    SHARE: 'share'
}

const def = Array(8).fill(0).map((val, index) => ({
    id: index,
    type: NotificationType.LIKE,
    timestamp: "2021-09-01T10:20:30Z",
    read: false,
    user: {
        id: index,
        username: `johndoe ${index}`,
        avatar_url: "https://example.com/path/to/avatar.jpg"
    },
    content: {
        text: `John Doe ${index} liked your post.`,
        url: "https://example.com/path/to/related/content",
        thumbnail_url: "https://example.com/path/to/thumbnail.jpg"
    },
    context: {
        post_id: "444555666",
        post_content: "This is a snippet or title of the related post...",
        comment_id: "777888999",
        comment_content: "This is a snippet of the related comment..."
    }
    
}))

const notificationSlice = createSlice({ 
    
    initialState: def,
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
    }
})

export const { addNotification, removeNotification, markAsRead } = notificationSlice.actions
export default notificationSlice.reducer