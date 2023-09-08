import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  combineReducers
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import DefaultLayout from './Layouts/DefaultLayout.jsx';
import chatReducer from './Modules/Chats.js';
import contactsReducer from './Modules/Contacts.js';
import friendRequestsReducer from './Modules/FriendRequests.js';
import postReducer from './Modules/Posts.js';
import profileReducer, { profileApiSlice } from './Modules/Profile.js';
import UIReducer from './Modules/UI.js';
import identityReducer from './Modules/User.js';
import LoginPage from './Pages/LoginPage.jsx';

import data from '@emoji-mart/data/sets/14/facebook.json';
import { configureStore } from '@reduxjs/toolkit';
import { init } from 'emoji-mart';
import { AnimatePresence } from 'framer-motion';
import { Modals } from './Components/Modals/Modals.jsx';
import StoryViewer from './Components/StoryViewer.jsx';
import callReducer from './Modules/Call.js';
import modalReducer from './Modules/Modals.js';
import notificationReducer from './Modules/Notifications.js';
import storiesReducer from './Modules/Stories.js';
import storiesUIReducer from './Modules/StoryUI.js';
import { HomePage } from './Pages/HomePage.jsx';
import { PeoplePage } from './Pages/PeoplePage.jsx';
import Profile from './Pages/ProfilePage.jsx';
import './index.css';
init({ data });
const rootReducer = combineReducers({
    identity: identityReducer,
    chats: chatReducer,
    contacts: contactsReducer,
    profile: profileReducer,
    friendRequests: friendRequestsReducer,
    UI: UIReducer,
    posts: postReducer,
    call: callReducer,
    stories: storiesReducer,
    storiesUI: storiesUIReducer,
    modals: modalReducer,
    notifications: notificationReducer,
    [profileApiSlice.reducerPath]: profileApiSlice.reducer

});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(profileApiSlice.middleware).concat(thunkMiddleware)
    
})

export const  App = () => {
  const location = window.location;
  return (
    <BrowserRouter>
    <Provider store={store}>
        <AnimatePresence>
        <Routes location={location} key={location.pathname}>
            <Route path='/login' element={<LoginPage />}></Route>
            <Route path='/' element={<DefaultLayout />}>
            <Route path='/people' element={<PeoplePage />}></Route>

                <Route path='/user/:id' element={<Profile />}></Route>
                <Route index element={<HomePage />}></Route>
            </Route>
            <Route path='/story/:id' element={<StoryViewer />}></Route>
        </Routes>
        </AnimatePresence>

        <Modals/>
    </Provider>
</BrowserRouter>
  )
}

export default App
