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
import { HideNotification } from './Reducers/UI';
import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

init({ data });


export const  App = () => {
  const location = window.location;
const notification = useSelector(state => state.UI.notification);
  const dispatch = useDispatch();
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
