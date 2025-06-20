import "./App.css"
import Missions from './scenes/Missions.tsx'
import Login from './scenes/Login.tsx'
import Map from './scenes/Map.tsx'
import Home from './scenes/Home.tsx'
import Terminal from './scenes/Terminal.tsx'
import NavBar from './components/NavBar'
import FileList from './scenes/FileList.tsx'
import BottomMenu from './components/BottomMenu.tsx'
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
        <Route path="/files" element={<FileList />} />
      </Routes>
      <BottomMenu />
    </Router>
  )
}

export default App
