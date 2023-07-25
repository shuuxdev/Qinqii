import {
    GET_AllChat,
    GET_FriendRequests,
    GET_Posts,
    GET_UserProfile,
} from '../Helper/Axios.js';
import { FETCH_CONTACTS } from '../Modules/Contacts.js';
import { FETCH_POSTS } from '../Modules/Posts.js';
import { FETCH_FRIEND_REQUESTS } from '../Modules/FriendRequests.js';
import { FETCH_PROFILE } from '../Modules/Profile.js';

const fetchDataThunk = (action) => async (dispatch, getState) => {
    let data;
    switch (action) {
        case FETCH_POSTS:
            data = (await GET_Posts()).data;
            break;
        case FETCH_FRIEND_REQUESTS:
            data = (await GET_FriendRequests()).data;
            break;
        case FETCH_PROFILE:
            data = (await GET_UserProfile()).data;
        case FETCH_CONTACTS:
            data = (await GET_AllChat()).data;
            break;
    }
    dispatch({ type: action, payload: data });
};
export default fetchDataThunk;
