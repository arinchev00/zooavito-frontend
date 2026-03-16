import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CategoryProvider } from './context/CategoryContext';
import { CategoryOrderProvider } from './context/CategoryOrderContext'; // добавить
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import AnnouncementsPage from './components/announcements/AnnouncementsPage';
import AnnouncementForm from './components/announcements/AnnouncementForm';
import AnnouncementDetail from './components/announcements/AnnouncementDetail';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import AdminPanel from './components/auth/AdminPanel';
import './App.css';
import './styles/main.css';
import CategoryOrder from './components/auth/CategoryOrder';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CategoryProvider>
          <CategoryOrderProvider>  {/* добавить */}
            <div className="App">
              <Header />
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/announcements/create" element={<AnnouncementForm />} />
                <Route path="/announcements/edit/:id" element={<AnnouncementForm />} />
                <Route path="/announcements/:id" element={<AnnouncementDetail />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/category-order" element={<CategoryOrder />} />
              </Routes>
              <Footer />
            </div>
          </CategoryOrderProvider>
        </CategoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;