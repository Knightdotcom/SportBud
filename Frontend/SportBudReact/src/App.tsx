import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router'
import Header from './components/Header/Header'
import HomePage from './pages/Home'
import RegisterPage from './pages/Register'
import LoginPage from './pages/Login'
import DetailedAuction from './pages/DetailedAuction'
import MyPage from './pages/MyPage/MyPage'
import NotFound from './pages/NotFound'

// Rot-komponenten som definierar applikationens sidrutter och renderar sidhuvudet
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auction/:id" element={<DetailedAuction />} />
        <Route path="/mypage/*" element={<MyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
