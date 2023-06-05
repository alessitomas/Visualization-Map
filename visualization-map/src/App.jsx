import { useState } from 'react'

import './App.css'
import MapPage from './pages/MapPage/MapPage'


function App() {
  return (
    <>
      <div id="centralize">
        <div id="title">
          <h1> <img id="icon-size" src="https://primedepartamentos.com/images/icons/map-icon-white.png"/> Mapa </h1>
        </div>
        <MapPage/>
      </div>
    </>
  )
}

export default App
