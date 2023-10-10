import React, { createContext, useEffect } from 'react';
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
import { addContact, increaseUnreadMessageCount, sendMessage, updateOnlineStatus } from './Reducers/Contacts';
import { openChat } from './Reducers/Chats';
import { notification } from 'antd';
import { useSignalRConnection } from './Hooks/useSignalRConnection';

init({ data });



export const AntdNotificationContext = createContext();
export const  App = () => {
  const location = window.location;
  const nt = useSelector(state => state.UI.notification);
  const [notify, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
    const me = useSelector(state => state.user.user_id)

    const connection = useSignalRConnection();
    useEffect(() => {


        connection.on('RecieveMessage', (json) => {
            let message = JSON.parse(json);
            dispatch(sendMessage(message))
            if(message.sender_id !== me)
            dispatch(increaseUnreadMessageCount(message.conversation_id));
            dispatch(addContact({
                conversation_id: message.conversation_id,
                ...message,
            }))
            dispatch(openChat(message.conversation_id));
        })
        connection.on('updateOnlineStatus', (user_id, status) => {
            console.log(user_id, status);
            dispatch(updateOnlineStatus({ user_id, status }));

        });//

        return () => {
            connection.off('RecieveMessage');
            connection.off('updateOnlineStatus');
            connection.off('ReceiveReaction');
        }
    })////

  return (
    <BrowserRouter>

        <AntdNotificationContext.Provider value={notify}>
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
            <Modals/>

        </AntdNotificationContext.Provider>

        {contextHolder}
        <Snackbar open={nt.visible} autoHideDuration={6000} onClose={() => dispatch(HideNotification())}>
            <Alert severity={nt.severity} onClose={() => dispatch(HideNotification())}>
                {nt.content}
            </Alert>
        </Snackbar>


    </BrowserRouter>
  )
}

export default App
