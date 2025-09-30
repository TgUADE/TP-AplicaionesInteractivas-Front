import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Form from './components/Form'
import Navigation from './views/Navigation'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Home from './views/Home'
import Contact from './views/Contact'

function App() {
  const navigate=useNavigate()
  const location=useLocation()
  const handleClick=()=>{
    navigate('/contact')
  }
  return (
    <>
    <Navigation/>
    <Routes>
      <Route path='/home' element={<Home/>}/>
      <Route path='/contact' element={<Contact/>}/>
    </Routes>
    <button onClick={handleClick}>Ir a contactos</button>
    <p>La ruta actual es: {location.pathname}</p>
    </>
  )
}

export default App;
