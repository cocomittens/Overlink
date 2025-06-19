import "./App.css"
import Missions from './scenes/Missions.tsx'
import Login from './scenes/Login.tsx'
import Map from './scenes/Map.tsx'
import Home from './scenes/Home.tsx'
import Terminal from './scenes/Terminal.tsx'
import NavBar from './components/NavBar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<Map />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/terminal" element={<Terminal />} />
      </Routes>
    </Router>
  )
}

export default App
