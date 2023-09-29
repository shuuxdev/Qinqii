import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import { combineReducers } from 'redux';
import userReducer from './Reducers/User';
import chatReducer from './Reducers/Chats';
import contactsReducer from './Reducers/Contacts';
import profileReducer, { profileApiSlice } from './Reducers/Profile';
import friendRequestsReducer from './Reducers/FriendRequests';
import UIReducer from './Reducers/UI';
import postReducer from './Reducers/Posts';
import callReducer from './Reducers/Call';
import storiesReducer from './Reducers/Stories';
import modalReducer from './Reducers/Modals';
import notificationReducer from './Reducers/Notifications';
import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';

const rootReducer = combineReducers({
    user: userReducer,
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
