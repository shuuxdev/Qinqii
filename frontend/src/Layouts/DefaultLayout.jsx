import Navbar from '../Components/Navbar.jsx';
import Color from '../Enums/Color.js';
import { sendMessage } from '../Modules/Chats.js';
import React, { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Card } from '../Components/Card.jsx';
import { Chat } from '../Components/Chat.jsx';
import { ContactList } from '../Components/Contacts.jsx';
import { FriendRequest } from '../Components/FriendRequest.jsx';
import { GroupRecommend } from '../Components/Groups.jsx';
import { Sidebar } from '../Components/Sidebar.jsx';
import { GlobalProvider } from '../Contexts/GlobalStateContext.jsx';
import connection from '../Helper/SignalR.js';


import Loading from '../Components/Loading.jsx';
import { useAxios } from '../Hooks/useAxios.jsx';
import { fetchContacts } from '../Modules/Contacts.js';
import { addFriendRequest, fetchFriendRequests } from '../Modules/FriendRequests.js';
import { fetchProfile } from '../Modules/Profile.js';
import { fetchStories } from '../Modules/Stories.js';
import { Grid } from 'antd';
import { addNotification, fetchNotifications } from '../Modules/Notifications.js';
import { useWebRTC } from '../Hooks/useWebRTC';
import CallModal from '../Components/CallModal';
export const CallContext = createContext();


const LeftSection = () => {
    return (
        <div className={`font-['Alexandria'] m-0 p-0 bg-[${Color.Background}]  box-border  flex flex-col  w-[300px] `}>
            <Card></Card>
            <Sidebar></Sidebar>
            {/*<GroupRecommend></GroupRecommend>*/}
        </div>
    )
}
const ChatContainer = () => {
    const chatList = useSelector((state) => state.chats)
    const dispatch = useDispatch()

    useEffect(() => {
        connection.on('RecieveMessage', (json) => {
            console.log(JSON.parse(json));
            dispatch(sendMessage(JSON.parse(json)))
        })
        return () => {
            connection.off('RecieveMessage');
        }
    }, [])



    return (
        <CallContext.Provider value={useWebRTC()}>
            <CallModal/>
        <div className='fixed flex gap-[10px] bottom-0 right-0  z-[100]'>
            {chatList.length > 0 && chatList.map((chat) =>
                <Chat key={chat.conversation_id} conversation_info={chat} />)
            }
        </div>
        </CallContext.Provider>

    )
}
const RightSection = () => {
    return (
        <div className={`font-['Alexandria'] m-0 p-0 bg-[${Color.Background}]  box-border flex flex-col  lg:w-[300px] `}>
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
            if (response.status == 'fulfilled') return response.value.data
        })
    )
    let ok = profile && contacts && friend_requests && stories && notifications;
    if (ok) {
        dispatch(fetchFriendRequests(friend_requests))
        dispatch(fetchContacts(contacts))
        dispatch(fetchProfile(profile))
        dispatch(fetchStories(stories))
        dispatch(fetchNotifications(notifications))

    }

    return ok;
}
const startConnection = () => {
    //Error: Cannot start a HubConnection that is not in the 'Disconnected' state.
    //Solution: hủy bỏ signalr connection cũ trước khi tạo connection mới
    connection
        .stop()
        .then(() => {
            connection
                .start()
                .then(() => {
                    console.log('SignalR ConnectionID ' + connection.connectionId)
                })
                .catch((e) => console.log('SignalR error: ' + e))
        })
        .catch((e) => console.log('SignalR error: ' + e))
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
        connection.on("ReceiveFriendRequest", (friend) => {
            dispatch(addFriendRequest(friend))
        })
    }, [])
    useEffect(() => {
        // only start connection when user is authenticated
        // that means when users are able to send authorized request
        if (allDataLoaded) startConnection()
    }, [allDataLoaded])
    return (
        <>{allDataLoaded ?
            <div className='flex flex-col justify-center items-center gap-[20px]'>

                <Navbar></Navbar>
                <div className='flex gap-[30px]'>
                    <LeftSection></LeftSection>
                    <div className={`font-['Alexandria'] m-0 p-0 bg-[${Color.Background}]  box-border gap-[25px] flex flex-col  w-[750px] `}>

                        <Outlet />
                    </div>
                    <RightSection></RightSection>
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