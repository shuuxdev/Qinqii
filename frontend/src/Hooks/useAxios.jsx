import axios from 'axios';
import Cookies from 'react-cookie/cjs/Cookies.js';
import { useNavigate } from 'react-router-dom';
import { SERVER_DOMAIN } from '../Enums/Server';
const cookies = new Cookies();


const api = axios.create({
    baseURL: `${SERVER_DOMAIN}/`,
    withCredentials: true,
});
const securedApi = axios.create({
    baseURL: `${SERVER_DOMAIN}/`,
    withCredentials: true,
});
const ResponseType = {
    StatusCode: 'StatusCode',
    Data: 'Data'
}
const GetApiResponseAs = async (api, responseType)  => {

    try {
        const res = await api;
        if(responseType === ResponseType.Data)
        {
            return [res.data, null]
        }
        else {
            return [res.status, null]
        }
    }
    catch (err)
    {
        return [null, err]
    }
}

const beforeSendingRequest = (request) => {
    let token = cookies.get('Token');
    request.headers.Authorization = `Bearer ${token}`;
    return request;
};
const onSuccessResponse = (response) => {
    return response;
};
const onFailedResponse = (err) => {
    return err;
};
export const useAxios = () => {
    const navigate = useNavigate();
    securedApi.interceptors.request.use(beforeSendingRequest);
    securedApi.interceptors.response.use(
        onSuccessResponse,
        (failedResponse) => {
            // cookies.remove('Token');
            // navigate('/login');
            return Promise.reject(failedResponse);
        }
    );

    const GET_Feed = async () => await securedApi.get('/feed');
    const GET_Stories = async (page, page_size) => {
        if(page && page_size) return securedApi.get(`/stories?PageNumber=${page}&PageSize=${page_size}`)
        return securedApi.get(`/stories`)
    }
    const GET_Story = async (id) =>  await GetApiResponseAs(securedApi
        .get(`/story?id=${id}`), ResponseType.Data)
    const GET_MyProfile = async () => await securedApi.get(`/user/profile`);
    const GET_UserProfile = async (user_id) => await securedApi.get(`/user/profile?id=${user_id}`);
    const GET_Messages = async () => await securedApi.get('/chat/messages');
    const GET_Notifications = async () => await securedApi.get('/notification/all');
    const GET_FriendRequests = async () =>
        await securedApi.get('/user/friend-requests');
    const GET_Friends = async () => await securedApi.get('/user/friends');
    const GET_FriendsWithName = async ( keyword) => await GetApiResponseAs(securedApi.get(`/user/friendsWithName?startWith=${keyword}`), ResponseType.Data);
    const GET_PeopleWithName = async ( keyword) => await GetApiResponseAs(securedApi.get(`/user/findByName?startWith=${keyword}`), ResponseType.Data);
    const POST_Login = async ({ username, password }) =>
        await api.post('/auth/login_jwt', {
            username,
            password,
        });
    const GET_UserPosts = async ({user_id, page, pageSize})=> await GetApiResponseAs(securedApi.get(`user/posts?id=${user_id}&page=${page}&pageSize=${pageSize}`), ResponseType.Data);
    const POST_SendMessage = async (message_info) =>
        await api.post('/chat/message', {
            message_info,
        });
    const GET_AllChat = async () =>  securedApi.get(`/chat/all`);
    const GET_Chat = async () => (await securedApi.get('/chat')).data;
    const appendToFormData = (formData, object) => {
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                formData.append(key, object[key]);
            }
        }
    }
    const POST_UpdateProfile = async (profile) => {
        const formFile = new FormData();
        appendToFormData(formFile, profile);

        return GetApiResponseAs(securedApi.post('/user/update-profile', formFile), ResponseType.StatusCode);
    }


    const     GET_UserImages  = async  ({user_id, page, pageSize}) => await GetApiResponseAs(securedApi.get(`user/images?id=${user_id}&page=${page}&pageSize=${pageSize}`), ResponseType.Data);
    const     GET_UserVideos           = async  ({user_id, page, pageSize}) => await GetApiResponseAs(securedApi.get(`user/videos?id=${user_id}&page=${page}&pageSize=${pageSize}`), ResponseType.Data);
    const     GET_UserFriends          = async  ({user_id, page, pageSize}) => await GetApiResponseAs(securedApi.get(`user/friends?id=${user_id}&page=${page}&pageSize=${pageSize}`), ResponseType.Data);
    const     GET_UserPeopleYouMayKnow = async  ({pageSize, page}) => await GetApiResponseAs(securedApi.get(`user/people-you-may-know?&page=${page}&pageSize=${pageSize}`), ResponseType.Data);

    const POST_CreateStory = async (videos, thumbnails, images ) => {

        if(videos.length != thumbnails.length) throw new Error('videos and thumbnails must have the same length')
        const formFile = new FormData();
        formFile.append('expire_after', 24);
        for(let i = 0; i < videos.length; i++)
        {
            formFile.append(`videos[${i}].video`, videos[i]);
            formFile.append(`videos[${i}].thumbnail.image`, thumbnails[i]);
        }
        for(let i = 0; i < images.length; i++)
        {
            formFile.append(`images[${i}].image`, images[i]);
        }
        return GetApiResponseAs(securedApi.post('/story/create', formFile), ResponseType.StatusCode);
    }

    const GET_RelationshipWithUser = (user_id) => GetApiResponseAs(securedApi.get(`/user/relationship-with-user?id=${user_id}`), ResponseType.Data);

     const POST_SendFriendRequest = async ({ friend_id }) =>
         GetApiResponseAs(securedApi.post('/user/send-friend-request', {  friend_id}), ResponseType.StatusCode);
     const POST_CancelFriendRequest = async ({ friend_id }) =>
            GetApiResponseAs(securedApi.post('/user/cancel-friend-request', {  friend_id}), ResponseType.StatusCode);
     const POST_Unfriend = async ({ friend_id }) =>
            GetApiResponseAs(securedApi.post('/user/unfriend', {  friend_id}), ResponseType.StatusCode);
    const api = {
        GET_FriendRequests,
        GET_Messages,
        GET_UserProfile,
        GET_Friends,
        POST_Login,
        POST_SendMessage,
       POST_UpdateProfile,
        POST_CreateStory,
        POST_SendFriendRequest,
        GET_AllChat,
        GET_Chat,
        GET_Stories,
        GET_Story,
        GET_MyProfile,
        GET_PeopleWithName,
        GET_Notifications,
        GET_FriendsWithName,
        GET_UserPosts,
        GET_UserImages,
        GET_UserVideos,
        GET_UserFriends,
        GET_UserPeopleYouMayKnow,
        GET_RelationshipWithUser,
        DELETE_CancelFriendRequest: POST_CancelFriendRequest,
        DELETE_Unfriend: POST_Unfriend,
    };
    return api;
};
