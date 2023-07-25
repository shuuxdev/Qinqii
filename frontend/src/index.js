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
import identityReducer from './Modules/Identity.js';
import profileReducer from './Modules/Profile.js';
import postReducer from './Modules/Posts.js';
import LoginPage from './Pages/LoginPage.jsx';
import UIReducer from './Modules/UI.js';

import { HomePage } from './Pages/HomePage.jsx';
import Profile from './Pages/ProfilePage.jsx';
import './index.css';
import data from '@emoji-mart/data/sets/14/facebook.json';
import { init } from 'emoji-mart';
import { Snackbar } from '@mui/material';
init({ data });
const rootReducer = combineReducers({
    identity: identityReducer,
    chats: chatReducer,
    contacts: contactsReducer,
    profile: profileReducer,
    friendRequests: friendRequestsReducer,
    UI: UIReducer,
    posts: postReducer,
});
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
);
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <Provider store={store}>
            <Routes>
                <Route path='/login' element={<LoginPage />}></Route>
                <Route path='/' element={<DefaultLayout />}>
                    <Route path='/user/:id' element={<Profile />}></Route>
                    <Route index element={<HomePage />}></Route>
                </Route>
            </Routes>
        </Provider>
    </BrowserRouter>
);
