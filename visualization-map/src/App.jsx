import { useState } from 'react'
import LandingPage from './Landing'
import './App.css'
import MapPage from './pages/MapPage/MapPage'
import { Route, Routes } from 'react-router-dom'
import MyMap from './pages/MapPage/test'


function App() {
  return (
    <div className='App'>
      <Routes> 
        <Route path="/" element={<LandingPage/>} />
        <Route path="/map" element={<MapPage/>} />
        <Route path='/test' element={<MyMap/>} />
      </Routes>
    </div>
  )
}

export default App
