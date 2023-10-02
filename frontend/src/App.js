import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DefaultLayout from './Layouts/DefaultLayout.jsx';
import LoginPage from './Pages/LoginPage.jsx';

import data from '@emoji-mart/data/sets/14/facebook.json';
import { init } from 'emoji-mart';
import { AnimatePresence } from 'framer-motion';
import { Modals } from './Components/Modals/Modals.jsx';
import StoryViewer from './Components/Story/StoryViewer.jsx';
import { HomePage } from './Pages/HomePage.jsx';
import { PeoplePage } from './Pages/PeoplePage.jsx';
import Profile from './Pages/ProfilePage.jsx';
import './index.css';
import { TestPage } from './Pages/TestPage';
import { HideNotification } from './Reducers/UI';
import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { MessagePage } from './Pages/MessagePage';
import connection from './Helper/SignalR';
import {
    increaseUnreadMessageCount,
    sendMessage,
    updateOnlineStatus,
    updateUnreadMessageCount,
} from './Reducers/Contacts';
import { openChat } from './Reducers/Chats';
import { useUserID } from './Hooks/useUserID';

init({ data });

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
export const  App = () => {
  const location = window.location;
const notification = useSelector(state => state.UI.notification);
  const dispatch = useDispatch();
    const me = useSelector(state => state.user.user_id)
    useEffect(() => {
        startConnection();
        connection.on('RecieveMessage', (json) => {
            console.log(JSON.parse(json));
            console.log(me);
            let message = JSON.parse(json);
            dispatch(sendMessage(message))
            if(message.sender_id !== me)
            dispatch(increaseUnreadMessageCount(message.conversation_id));
            dispatch(openChat(message.conversation_id));
        })
        connection.on('updateOnlineStatus', (user_id, status) => {
            console.log(user_id, status);
            dispatch(updateOnlineStatus({ user_id, status }));

        });
        return () => {
            connection.off('RecieveMessage');
            connection.off('updateOnlineStatus');
        }
    }, [])

  return (
    <BrowserRouter>

        <AnimatePresence>
        <Routes location={location} key={location.pathname}>
            <Route path='/login' element={<LoginPage />}></Route>
            <Route path='/' element={<DefaultLayout />}>
                <Route path='/people' element={<PeoplePage />}></Route>
                <Route path='/user/:id/*' element={<Profile />}></Route>
                <Route index element={<HomePage />}></Route>
                <Route path='/test' element={<TestPage/>}></Route>

            </Route>
            <Route path='/story/:id' element={<StoryViewer />}></Route>
            <Route path='/message/:id' element={<MessagePage/>}></Route>
            <Route path='/message' element={<MessagePage/>}></Route>
        </Routes>

        </AnimatePresence>
        <Snackbar open={notification.visible} autoHideDuration={6000} onClose={() => dispatch(HideNotification())}>
            <Alert severity={notification.severity} onClose={() => dispatch(HideNotification())}>
                {notification.content}
            </Alert>
        </Snackbar>
        <Modals/>


    </BrowserRouter>
  )
}

export default App
