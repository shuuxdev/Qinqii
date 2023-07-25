export const fetchContactsAction = (contacts) => ({
    type: FETCH_CONTACTS,
    payload: contacts,
});
export const FETCH_CONTACTS = 'FETCH_CONTACTS';

const Reducer = (state = [], action) => {
    switch (action.type) {
        case FETCH_CONTACTS:
            return action.payload;
        default:
            return state;
    }
};
export default Reducer;
