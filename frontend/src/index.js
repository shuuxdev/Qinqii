import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
    applyMiddleware,
    combineReducers,
    legacy_createStore as createStore,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import DefaultLayout from './Layouts/DefaultLayout.jsx';
import chatReducer from './Modules/Chats.js';
import contactsReducer from './Modules/Contacts.js';
import friendRequestsReducer from './Modules/FriendRequests.js';
import identityReducer from './Modules/User.js';
import profileReducer, { profileApiSlice } from './Modules/Profile.js';
import postReducer from './Modules/Posts.js';
import LoginPage from './Pages/LoginPage.jsx';
import UIReducer from './Modules/UI.js';

import { HomePage } from './Pages/HomePage.jsx';
import Profile from './Pages/ProfilePage.jsx';
import './index.css';
import data from '@emoji-mart/data/sets/14/facebook.json';
import { init } from 'emoji-mart';
import { Snackbar } from '@mui/material';
import callReducer from './Modules/Call.js';
import storiesReducer from './Modules/Stories.js';
import storiesUIReducer  from './Modules/StoryUI.js';
import StoryViewer from './Components/StoryViewer.jsx';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Modals } from './Components/Modals/Modals.jsx';
import modalReducer from './Modules/Modals.js';
import notificationReducer from './Modules/Notifications.js';
import { PeoplePage } from './Pages/PeoplePage.jsx';
import { AnimatePresence } from 'framer-motion';
import App from './App.js';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <App/>
);
