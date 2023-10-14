import React, { createContext } from 'react';
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
import { MessagePage } from './Pages/MessagePage';
import { notification } from 'antd';
import { PostPage } from './Pages/PostPage';
import { useWebRTC } from './Hooks/useWebRTC';
import { CallContext } from './Layouts/DefaultLayout';
import NotFound from './Pages/NotFoundPage';

init({ data });


export const AntdNotificationContext = createContext();
export const GlobalContext = createContext();


export const App = () => {

    const location = window.location;
    const [notify, contextHolder] = notification.useNotification();


    return (
        <BrowserRouter>
            <CallContext.Provider value={useWebRTC()}>

                    <AntdNotificationContext.Provider value={notify}>
                        <AnimatePresence>
                            <Routes location={location} key={location.pathname}>
                                <Route path='/login' element={<LoginPage />}></Route>
                                <Route path='/' element={<DefaultLayout />}>
                                    <Route path='/people' element={<PeoplePage />}></Route>
                                    <Route path='/user/:id/*' element={<Profile />}></Route>
                                    <Route index element={<HomePage />}></Route>
                                    <Route path='/test' element={<TestPage />}></Route>
                                    <Route path='/post/:id' element={<PostPage />}></Route>
                                    <Route path='/post/:id/to/:comment_id' element={<PostPage />}></Route>
                                </Route>
                                <Route path='/story/:id' element={<StoryViewer />}></Route>
                                <Route path='/message/:id' element={<MessagePage />}></Route>
                                <Route path='/message' element={<MessagePage />}></Route>
                                <Route path='*' element={<NotFound/>}></Route>
                            </Routes>

                        </AnimatePresence>
                        <Modals />

                    </AntdNotificationContext.Provider>

                {contextHolder}


            </CallContext.Provider>
        </BrowserRouter>
    );
};

export default App;
