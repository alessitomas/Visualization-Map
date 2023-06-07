import { useState } from 'react'
import LandingPage from './Landing'
import './App.css'
import MapPage from './pages/MapPage/MapPage'
import MapPageMacro from './pages/MapPageMacro/MapPageMacro'
import { Route, Routes } from 'react-router-dom'


function App() {
  return (
    <div className='App'>
      <Routes> 
        <Route path="/" element={<LandingPage/>} />
        <Route path="/map" element={<MapPage/>} />
        <Route path="/mapmacro" element={<MapPageMacro/>} />
      </Routes>
    </div>
  )
}

export default App
