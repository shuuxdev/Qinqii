import { Route, Routes } from 'react-router-dom'


import React from 'react'
import DefaultLayout from './Layouts/DefaultLayout.jsx'

export 

function App() {
  
  return (
    <div className='flex justify-center items-center'>
        <Routes>
          <Route element={<DefaultLayout />}>
            
          </Route>
        </Routes>
    </div>
  )
}

export default App
