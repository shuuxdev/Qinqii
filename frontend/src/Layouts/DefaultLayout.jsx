import Navbar from '../Components/Common/Navbar.jsx';
import Color from '../Enums/Color.js';
import React, { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Card } from '../Components/Common/Card.jsx';
import { Chat } from '../Components/Chat/Chat.jsx';
import { ContactList } from '../Components/Chat/Contacts.jsx';
import { FriendRequest } from '../Components/Friend/FriendRequest.jsx';
import { Sidebar } from '../Components/Common/Sidebar.jsx';
import { GlobalProvider } from '../Contexts/GlobalStateContext.jsx';
import connection from '../Helper/SignalR.js';


import Loading from '../Components/Common/Loading.jsx';
import { useAxios } from '../Hooks/useAxios.jsx';
import { fetchContacts, sendMessage } from '../Reducers/Contacts.js';
import { addFriendRequest, fetchFriendRequests } from '../Reducers/FriendRequests.js';
import { fetchProfile } from '../Reducers/Profile.js';
import { fetchStories } from '../Reducers/Stories.js';
import { addNotification, fetchNotifications } from '../Reducers/Notifications.js';
import { useWebRTC } from '../Hooks/useWebRTC';
import CallModal from '../Components/Modals/CallModal';
import MediaQuery from 'react-responsive';
import { ScreenWidth } from '../Enums/ScreenWidth';
import { fetchUser } from '../Reducers/User';

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
        <CallContext.Provider value={useWebRTC()}>
            <CallModal/>
            <div className='fixed flex gap-[10px] bottom-0 right-0  z-[100]'>
            {chatList.length > 0 && chatList.map((chat) =>
                <Chat key={chat.conversation_id} contact={chat} />)
            }
            </div>
        </CallContext.Provider>
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
    useEffect(() => {
        pageReady();
        connection.on("ReceiveNotification", (notification) => {
            dispatch(addNotification(notification))
        })
        connection.on("ReceiveFriendRequest", (friend, request_id) => {
            dispatch(addFriendRequest({...friend,id: request_id}))
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
                <p>Đang tải trang, vui lòng chờ</p>
            </div>
        }
        </>
    )
}
export default DefaultLayout;