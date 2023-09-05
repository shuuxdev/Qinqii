import Navbar from "../Components/Navbar.jsx"
import Color from "../Enums/Color.js"
import { sendMessage } from "../Modules/Chats.js"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { Card } from "../Components/Card.jsx"
import { Chat } from "../Components/Chat.jsx"
import { ContactList } from '../Components/Contacts.jsx'
import { FriendRequest } from "../Components/FriendRequest.jsx"
import { GroupRecommend } from "../Components/Groups.jsx"
import { Sidebar } from "../Components/Sidebar.jsx"
import { GlobalProvider } from "../Contexts/GlobalStateContext.jsx"
import connection from "../Helper/SignalR.js"


import Loading from "../Components/Loading.jsx"
import { useAxios } from '../Hooks/useAxios.jsx'
import { fetchContacts, fetchContactsAction } from '../Modules/Contacts.js'
import { fetchFriendRequestsAction } from '../Modules/FriendRequests.js'
import { fetchProfileAction } from '../Modules/Profile.js'
import { Snackbar } from "@mui/material"
import { fetchStories } from "../Modules/Stories.js"
import { Grid } from "antd"
import { addNotification, fetchNotifications } from "../Modules/Notifications.js"
const LeftSection = () => {
    return (
        <div className={`font-['Alexandria'] m-0 p-0 bg-[${Color.Background}]  box-border  flex flex-col  lg:w-[300px] `}>
            <Card></Card>
            <Sidebar></Sidebar>
            <GroupRecommend></GroupRecommend>
        </div>
    )
}
const ChatContainer = () => {
    const chatList = useSelector((state) => state.chats)
    const dispatch = useDispatch()

    useEffect(() => {
        connection.on('RecieveMessage', (message) => {
            dispatch(sendMessage(message))
        })

    }, [])

    return (
        <div className='px-[50px] fixed flex gap-[10px] bottom-0 right-0  z-[100]'>
            {chatList.length > 0 && chatList.map((chat) =>
                <Chat key={chat.conversation_id} conversation_info={chat} />)
            }
        </div>
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
        dispatch(fetchFriendRequestsAction(friend_requests))
        dispatch(fetchContacts(contacts))
        dispatch(fetchProfileAction(profile))
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
    const screen = Grid.useBreakpoint();
    const dispatch = useDispatch()
    const axios = useAxios()


    const [allDataLoaded, setAllDataLoaded] = useState(false)
    const pageReady = async () => {
        setAllDataLoaded(await initApiCall(axios, dispatch))
    }
    useEffect(() => {
        pageReady();
        connection.on("ReceiveNotification", (notification) => {
            console.log(notification)
            dispatch(addNotification(notification))
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
                    <div className={`font-['Alexandria'] m-0 p-0 bg-[${Color.Background}]  box-border gap-[25px] flex flex-col  lg:w-[750px] `}>

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