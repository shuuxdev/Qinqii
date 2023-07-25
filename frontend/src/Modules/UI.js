export const OPEN_CREATE_POST_DIALOG = 'OPEN_CREATE_POST_DIALOG';
export const CLOSE_CREATE_POST_DIALOG = 'CLOSE_CREATE_POST_DIALOG';
const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';
const OPEN_PICKER = 'OPEN_PICKER';
const CLOSE_PICKER = 'CLOSE_PICKER';
export const OpenDialog = () => ({ type: OPEN_CREATE_POST_DIALOG });
export const CloseDialog = () => ({ type: CLOSE_CREATE_POST_DIALOG });

export const ShowNotification = (noti_info) => ({
    type: SHOW_NOTIFICATION,
    payload: noti_info,
});
export const HideNotification = () => ({ type: HIDE_NOTIFICATION });
const def = {
    create_post_open: false,
    notification: {
        visible: false,
        content: '',
        sevirity: '',
    },
    picker: false,
};
const Reducer = (state = def, action) => {
    switch (action.type) {
        case OPEN_CREATE_POST_DIALOG:
            return { ...state, create_post_open: true };
        case CLOSE_CREATE_POST_DIALOG:
            return { ...state, create_post_open: false };
        case SHOW_NOTIFICATION:
            return {
                ...state,
                notification: {
                    visible: true,
                    content: action.payload.content,
                    severity: action.payload.severity,
                },
            };
        case HIDE_NOTIFICATION:
            return { ...state, notification: { visible: false } };
        case CLOSE_PICKER:
            return { ...state, picker: true };
        case CLOSE_PICKER:
            return { ...state, picker: false };

        default:
            return state;
    }
};
export default Reducer;
