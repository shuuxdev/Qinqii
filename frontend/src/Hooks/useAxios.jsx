import axios from 'axios';
import Cookies from 'react-cookie/cjs/Cookies.js';
import { useNavigate } from 'react-router-dom';
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
const onFailedResponse = (err) => {
    return err;
};
export const useAxios = () => {
    const navigate = useNavigate();
    securedApi.interceptors.request.use(beforeSendingRequest);
    securedApi.interceptors.response.use(
        onSuccessResponse,
        (failedResponse) => {
            cookies.remove('Token');
            navigate('/login');
            return Promise.reject(failedResponse);
        }
    );
    const GET_Feed = async () => await securedApi.get('/feed');
    const GET_UserProfile = async () => await securedApi.get('/user/profile');
    const GET_Messages = async () => await securedApi.get('/chat/messages');
    const GET_ConnectionId = async () =>
        (await securedApi.get('/user/connection')).data;
    const GET_FriendRequests = async () =>
        await securedApi.get('/user/friend-requests');
    const GET_Friends = async () => await securedApi.get('/user/friends');
    const POST_Login = async ({ username, password }) =>
        await api.post('/auth/login_jwt', {
            username,
            password,
        });

    const POST_SendMessage = async (message_info) =>
        await api.post('/chat/message', {
            message_info,
        });
    const GET_AllChat = async () => await securedApi.get(`/chat/all`);
    const GET_Chat = async () => (await securedApi.get('/chat')).data;
    const api = {
        GET_FriendRequests,
        GET_Messages,
        GET_UserProfile,
        GET_ConnectionId,
        GET_Friends,
        POST_Login,
        POST_SendMessage,
        GET_AllChat,
        GET_Chat,
    };
    return api;
};
