export const fetchProfileAction = (profile) => ({
    type: FETCH_PROFILE,
    payload: profile,
});

export const FETCH_PROFILE = 'FETCH_PROFILE';
const def = {
    id: 0,
    name: '',
    background: '',
    avatar: '',
};
const Reducer = (state = def, action) => {
    switch (action.type) {
        case FETCH_PROFILE:
            return action.payload;
        default:
            return state;
    }
};
export default Reducer;
