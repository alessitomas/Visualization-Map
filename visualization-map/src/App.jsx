import { useState } from 'react'
import LandingPage from './Landing'
import './App.css'
import MapPage from './pages/MapPage/MapPage'
import { Route, Routes } from 'react-router-dom'


function App() {
  return (
    <div className='App'>
      <Routes> 
        <Route path="/" element={<LandingPage/>} />
        <Route path="/map" element={<MapPage/>} />
      </Routes>
    </div>
  )
}

export default App
