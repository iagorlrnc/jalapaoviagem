import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { AdminPage } from './pages/AdminPage'
import { AdminLoginPage } from './pages/AdminLoginPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}
