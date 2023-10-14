import Navbar from '../Components/Common/Navbar.jsx';
import Color from '../Enums/Color.js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Card } from '../Components/Common/Card.jsx';
import { Chat } from '../Components/Chat/Chat.jsx';
import { ContactList } from '../Components/Chat/Contacts.jsx';
import { FriendRequest } from '../Components/Friend/FriendRequest.jsx';
import { Sidebar } from '../Components/Common/Sidebar.jsx';
import { GlobalProvider } from '../Contexts/GlobalStateContext.jsx';
import connection, { startSignalRConnection } from '../Helper/SignalR.js';


import Loading from '../Components/Common/Loading.jsx';
import { useAxios } from '../Hooks/useAxios.jsx';
import {
    addContact,
    fetchContacts,
    increaseUnreadMessageCount,
    sendMessage,
    updateOnlineStatus,
} from '../Reducers/Contacts.js';
import { addFriendRequest, fetchFriendRequests } from '../Reducers/FriendRequests.js';
import { fetchProfile } from '../Reducers/Profile.js';
import { fetchStories } from '../Reducers/Stories.js';
import { addNotification, fetchNotifications } from '../Reducers/Notifications.js';
import { useWebRTC } from '../Hooks/useWebRTC';
import CallModal from '../Components/Modals/CallModal';
import MediaQuery from 'react-responsive';
import { ScreenWidth } from '../Enums/ScreenWidth';
import { fetchUser } from '../Reducers/User';
import { AntdNotificationContext } from '../App';
import { NotificationType } from '../Enums/NotificationType';
import { openChat } from '../Reducers/Chats';
import { useUserID } from '../Hooks/useUserID';

export const CallContext = createContext();


const LeftSection = () => {
    return (
        <div style={{flexBasis : '270px'}}  className={`  bg-[${Color.Background}]  box-border  flex flex-col min-w-max shrink-1`}>
            <Card></Card>
            <Sidebar></Sidebar>
            {/*<GroupRecommend></GroupRecommend>*/}
        </div>
    )
}
const ChatContainer = () => {
    const openedChatList = useSelector((state) => state.chats)
    const contacts = useSelector(state => state.contacts)
    const dispatch = useDispatch()


    let chatList = openedChatList.map((id) => contacts.find((contact) => contact.conversation_id === id))

    return (
        <div >
            <CallModal/>
            <div className='fixed flex gap-[10px] bottom-0 right-[30px]  z-[100]'>
            {chatList.length > 0 && chatList.map((chat) =>
                <Chat key={chat.conversation_id} contact={chat} />)
            }
            </div>
        </div>
    )
}
const RightSection = () => {
    return (
        <div style={{flexBasis : '270px'}}  className={` bg-[${Color.Background}]  box-border flex flex-col   shrink w-[300px] `}>
            <GlobalProvider>
                <FriendRequest></FriendRequest>
                <ContactList></ContactList>
                <ChatContainer></ChatContainer>
            </GlobalProvider>
        </div>
    )
}

const initApiCall = async (axios, dispatch) => {
    const apiList = [axios.GET_MyProfile(), axios.GET_AllChat(), axios.GET_FriendRequests(), axios.GET_Stories(), axios.GET_Notifications()]
    const [profile, contacts, friend_requests, stories, notifications] = await Promise.allSettled(apiList).then((responseList) =>
        responseList.map((response) => {
            if (response.status === 'fulfilled') return response.value.data
        })
    )
    let ok = profile && contacts && friend_requests && stories && notifications;
    if (ok) {
        dispatch(fetchUser(profile));
        dispatch(fetchFriendRequests(friend_requests))
        dispatch(fetchContacts(contacts))
        dispatch(fetchProfile(profile))
        dispatch(fetchStories(stories))
        dispatch(fetchNotifications(notifications))

    }
    return ok;
}

const DefaultLayout = () => {
    const dispatch = useDispatch()
    const axios = useAxios()


    const [allDataLoaded, setAllDataLoaded] = useState(false)
    const pageReady = async () => {
        setAllDataLoaded(await initApiCall(axios, dispatch))
    }
    const me = useUserID();
    const notify = useContext(AntdNotificationContext);
    useEffect(() => {
        startSignalRConnection(connection);
    }, []);
    useEffect(() => {


        connection.on('RecieveMessage', (json) => {
            let message = JSON.parse(json);
            dispatch(sendMessage(message));
            if (message.sender_id !== me)
                dispatch(increaseUnreadMessageCount(message.conversation_id));
            dispatch(addContact({
                conversation_id: message.conversation_id,
                ...message,
            }));
            dispatch(openChat(message.conversation_id));
        });
        connection.on('updateOnlineStatus', (user_id, status) => {
            console.log(user_id, status);
            dispatch(updateOnlineStatus({ user_id, status }));

        });//

        return () => {
            connection.off('RecieveMessage');
            connection.off('updateOnlineStatus');
            connection.off('ReceiveReaction');
        };
    });
    useEffect(() => {
        pageReady();

        connection.on("ReceiveNotification", (notification) => {
            console.log(notification)

            if(notification.type === NotificationType.FRIEND_ACCEPT) {
                notify.open({
                    message: `${notification.actor_name} đã chấp nhận lời mời kết bạn của bạn`,
                    type: 'info',
                    duration: 5,
                    placement: 'bottomLeft'
                })
            }
            dispatch(addNotification(notification))
        })
        connection.on("ReceiveFriendRequest", (friend, request_id) => {
            dispatch(addFriendRequest({...friend,id: request_id}));
            notify.open({
                message: `${friend.name} đã gửi cho bạn một lời mời kết bạn`,
                type: 'info',
                duration: 5,
                placement: 'bottomLeft'
            })
        })
        return () => {
            connection.off("ReceiveNotification");
            connection.off("ReceiveFriendRequest");
        }
    },[])

    return (
        <>{allDataLoaded ?
            <div className='flex flex-col justify-center items-center gap-[20px]'>

                <Navbar></Navbar>
                <div className='flex w-full gap-[30px] max-w-[1500px] '>
                    <MediaQuery minWidth={ScreenWidth.lg}>

                    <LeftSection></LeftSection>
                        </MediaQuery>
                    <div className={` bg-[${Color.Background}]  box-border gap-[25px] flex basis-1 flex-col grow shrink-[2]`}>

                        <Outlet />
                    </div>
                    <MediaQuery minWidth={ScreenWidth.xl}>
                        <RightSection></RightSection>
                    </MediaQuery>
                </div>
            </div> : <div className='flex justify-center  h-[100vh] gap-[20px] flex-col items-center'>
                <Loading></Loading>
            </div>
        }
        </>
    )
}
export default DefaultLayout;