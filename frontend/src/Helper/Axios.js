import axios from 'axios';
import Cookies from 'react-cookie/cjs/Cookies.js';
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
        if(responseType == ResponseType.Data)
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
securedApi.interceptors.request.use(beforeSendingRequest);
securedApi.interceptors.response.use(onSuccessResponse, (err) => {
    // cookies.remove('Token');
    // window.location.href = '/login';
    return Promise.reject(err);
});
export const GET_Posts = async () => await securedApi.get('/feed');

export const GET_UserProfile = async (user_id) =>
     GetApiResponseAs(securedApi.get(`/user?id=${user_id}`), ResponseType.Data);

export const GET_Messages = async (conversation_id) =>
    await securedApi.get(`/chat?id=${conversation_id}`);
export const GET_Friends = async (user_id) =>
    (await securedApi.get('/user/friends')).data;
export const GET_FriendRequests = async () =>
    await securedApi.get('/user/friend-requests');
export const POST_Login = async ({ email, password }) =>
    await api.post('/auth/login_jwt', {
        email,
        password,
    });

export const POST_SendMessage = async (message, images, videos, thumbnails) =>
{

    if(thumbnails.length != videos.length) throw new Error('Thumbnail and video length must be equal');
    const formData = new FormData();
    appendToFormData(formData, message);
    for (let i = 0; i < images.length; ++i) {
        formData.append(`images[${i}].image`, images[i]);
    }

    for (let i = 0; i < videos.length; ++i) {
        formData.append(`videos[${i}].video`, videos[i]);
        formData.append(`videos[${i}].thumbnail.image`, thumbnails[i]);
    }
    return securedApi.post('/chat/message', formData);
}

const appendToFormData = (formData, object) => {
    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            formData.append(key, object[key]);
        }
    }
}

export const GET_AllChat = async () => await securedApi.get('/chat/all');
export const PATCH_FriendStatus = async ({ id, status }) =>
    await securedApi.patch('/user/update-friend-status', { id, status });
export const POST_SendFriendRequest = async ({ friend_id }) =>
    await securedApi.post('/user/send-friend-request', {  friend_id});
export const GET_Chat = async () => (await securedApi.get('/chat')).data;

export const SEND_React = async (payload) =>
    await GetApiResponseAs(securedApi
        .patch('/react', payload), ResponseType.Data)
        
export const UNDO_REACT = async (id) =>
    await GetApiResponseAs(securedApi
        .delete(`/undo-react?id=${id}`),ResponseType.StatusCode)

export const GET_UserPosts = async ({user_id, page, pageSize})=>  GetApiResponseAs(securedApi.get(`user/posts?user_id=${user_id}&page=${page}&pageSize=${pageSize}`), ResponseType.Data);
export const     GET_UserImages  = async  ({user_id, page, pageSize}) => await GetApiResponseAs(securedApi.get(`user/images?user_id=${user_id}&page=${page}&pageSize=${pageSize}`), ResponseType.Data);
export const     GET_UserVideos           = async  ({user_id, page, pageSize}) => await GetApiResponseAs(securedApi.get(`user/videos?user_id=${user_id}&page=${page}&pageSize=${pageSize}`), ResponseType.Data);
export const     GET_UserFriends          = async  ({user_id, page, pageSize}) => await GetApiResponseAs(securedApi.get(`user/friends?user_id=${user_id}&page=${page}&pageSize=${pageSize}`), ResponseType.Data);
export const DELETE_Post = async (post_id) => GetApiResponseAs(securedApi.delete(`/post/delete?id=${post_id}`), ResponseType.StatusCode)

export const POST_UpdateStoryViewer = async (story_id) =>
    await GetApiResponseAs(securedApi.post(`/story/update-viewer?id=${story_id}`, ), ResponseType.StatusCode)

export const GET_Story = async (story_id) =>
        await GetApiResponseAs(securedApi
            .get(`/story?id=${story_id}`), ResponseType.Data)

export const POST_UploadAttachments = async (attachments) => {
    const formData = new FormData();
    for (let i = 0; i < attachments.length; ++i) {
        formData.append('attachments', attachments[i]);
    }
    return await GetApiResponseAs(securedApi
        .post('/post/upload-attachments', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }), ResponseType.Data);
}
export const POST_CreateNewPost = async ({ content, videos, images, thumbnails }) => {
    const formData = new FormData();
    if (videos.length === thumbnails.length) {


        formData.append('content', content);
        for (let i = 0; i < videos.length; ++i) {
            formData.append(`videos[${i}].video`, videos[i]);
            formData.append(`videos[${i}].thumbnail.image`, thumbnails[i]);
        }
        for (let i = 0; i < images.length; ++i) {
            formData.append(`images[${i}].image`, images[i]);
        }

        return await GetApiResponseAs(securedApi.post('/post/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }), ResponseType.StatusCode);
    }
}
export const EDIT_Post = async ({ comment_id, content, attachments }) => {
    let files = [...attachments];
    const formData = new FormData();
    formData.append('content', content);
    formData.append('comment_id', comment_id);
    for (let i = 0; i < files.length; ++i) {
        formData.append('attachments', files[i]);
    }
    return await securedApi.post('/comment/edit', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
export const POST_MarkAsRead = async (conversation_id) => {
    return await GetApiResponseAs(securedApi.post('/chat/mark-as-read',  {conversation_id} ), ResponseType.StatusCode);
}
export const POST_NotificationMarkAsRead = async (notification_id) => {
    return await GetApiResponseAs(securedApi.post('/notification/mark-as-read',  {notification_id} ), ResponseType.StatusCode);
}
export const DELETE_Comment = async (comment_id) =>
    await securedApi
        .delete(`/comment/delete?id=${comment_id}`)
        .then((res) => [res.status, null])
        .catch((err) => [null, err]);

export const EDIT_Comment = async ({deleted_attachments, new_attachments,...comment}) => {
    let formData = new FormData();
    formData.append('deleted_attachments', deleted_attachments);
    for (let i = 0; i < new_attachments.length; ++i) {
        formData.append('new_attachments', new_attachments[i]);
    }
    appendToFormData(formData, comment);
    return await GetApiResponseAs(securedApi.patch('/comment/edit', formData), ResponseType.Data)

};
export const UPLOAD_Attachments = async (attachments) => {
    const formData = new FormData();
    for (let i = 0; i < attachments.length; ++i) {
        formData.append('images', attachments[i]);
    }
    return await GetApiResponseAs(securedApi
        .post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }), ResponseType.Data);
};
export const CREATE_Comment = async ({ post_id, content, attachments,parent_id }) => {
    let files = [...attachments];
    const formData = new FormData();
    formData.append('content', content);
    formData.append('post_id', post_id);
    formData.append('parent_id', parent_id);
    for (let i = 0; i < files.length; ++i) {
        formData.append('attachments', files[i]);
    }

    return await securedApi.post('/comment/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
