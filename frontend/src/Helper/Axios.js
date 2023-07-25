import axios from 'axios';
import Cookies from 'react-cookie/cjs/Cookies.js';
const cookies = new Cookies();

const SERVER_DOMAIN = 'https://localhost:7084';
const api = axios.create({
    baseURL: `${SERVER_DOMAIN}/`,
    withCredentials: true,
});
const securedApi = axios.create({
    baseURL: `${SERVER_DOMAIN}/`,
    withCredentials: true,
});

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
export const GET_Posts = async (user_id) => await securedApi.get('/feed');

export const GET_UserProfile = async (user_id) =>
    await securedApi.get('/user/profile');
export const GET_ConnectionId = async (user_id) =>
    (await securedApi.get('/user/connection')).data;
export const GET_Messages = async (conversation_id) =>
    await securedApi.get(`/chat?id=${conversation_id}`);
export const GET_Friends = async (user_id) =>
    (await securedApi.get('/user/friends')).data;
export const GET_FriendRequests = async () =>
    await securedApi.get('/user/friend-requests');
export const POST_Login = async ({ username, password }) =>
    await api.post('/auth/login_jwt', {
        username,
        password,
    });

export const POST_SendMessage = async (message_info) =>
    await securedApi.post('/chat/message', {
        ...message_info,
    });
export const GET_AllChat = async () => await securedApi.get('/chat/all');
export const PATCH_FriendStatus = async ({ id, action }) =>
    await securedApi.patch('/user/update-friend-status', { id, action });
export const GET_Chat = async () => (await securedApi.get('/chat')).data;

export const SEND_React = async ({ entity_id, entity_type, emoji }) =>
    await securedApi
        .patch('/react', { entity_id, entity_type, emoji })
        .then((res) => [res.data, null])
        .catch((err) => [null, err]);

export const DELETE_Post = async (post_id) =>
    await securedApi
        .delete(`/post/delete?id=${post_id}`)
        .then((res) => [res.status, null])
        .catch((err) => [null, err]);

export const POST_CreateNewPost = async ({ content, attachments }) => {
    let files = [...attachments];
    const formData = new FormData();
    formData.append('content', content);
    for (let i = 0; i < files.length; ++i) {
        formData.append('attachments', files[i]);
    }

    return await securedApi.post('/post/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
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

export const DELETE_Comment = async (comment_id) =>
    await securedApi
        .delete(`/comment/delete?id=${comment_id}`)
        .then((res) => [res.status, null])
        .catch((err) => [null, err]);

export const EDIT_Comment = async (comment) => {
    return await securedApi
        .patch('/comment/edit', comment)
        .then((res) => [res.data, null])
        .catch((err) => [null, err]);
};
export const UPLOAD_Attachments = async (attachments) => {
    const formData = new FormData();
    for (let i = 0; i < attachments.length; ++i) {
        formData.append('images', attachments[i]);
    }
    return await securedApi
        .post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => [res.data, null])
        .catch((err) => [[], err]);
};
export const CREATE_Comment = async ({ post_id, content, attachments }) => {
    let files = [...attachments];
    const formData = new FormData();
    formData.append('content', content);
    formData.append('post_id', post_id);
    for (let i = 0; i < files.length; ++i) {
        formData.append('attachments', files[i]);
    }

    return await securedApi.post('/comment/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
