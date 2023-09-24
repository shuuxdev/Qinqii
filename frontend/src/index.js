import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import { combineReducers } from 'redux';
import identityReducer from './Modules/User';
import chatReducer from './Modules/Chats';
import contactsReducer from './Modules/Contacts';
import profileReducer, { profileApiSlice } from './Modules/Profile';
import friendRequestsReducer from './Modules/FriendRequests';
import UIReducer from './Modules/UI';
import postReducer from './Modules/Posts';
import callReducer from './Modules/Call';
import storiesReducer from './Modules/Stories';
import modalReducer from './Modules/Modals';
import notificationReducer from './Modules/Notifications';
import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';

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
    modals: modalReducer,
    notifications: notificationReducer,
    [profileApiSlice.reducerPath]: profileApiSlice.reducer

});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(profileApiSlice.middleware).concat(thunkMiddleware)

})
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
    <App/>
    </Provider>
);
