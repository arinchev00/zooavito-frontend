import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CategoryDropdown from '../categories/CategoryDropdown';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">
        <Link className="navbar-brand" to="/home">
          <i className="fas fa-paw"></i>
          ZooAvito
        </Link>

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMain">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <CategoryDropdown />

          {/* Кнопка для админа - ВНУТРИ return! */}
          {isAuthenticated && user?.email === 'admin123@admin.com' && (
            <div className="mr-3">
              <Link to="/admin" className="btn btn-outline-light">
                <i className="fas fa-cog"></i> Панель Админа
              </Link>
            </div>
          )}

          {!isAuthenticated ? (
            <div>
              <Link to="/login" className="btn btn-outline-light mr-2">Вход</Link>
              <Link to="/register" className="btn btn-light">Регистрация</Link>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              <div className="user-info">
                <i className="fas fa-user-circle"></i>
                <span className="user-name">{user?.email}</span>
              </div>
              <button 
                className="btn btn-sm btn-outline-light ml-2" 
                onClick={handleLogout}
                style={{ 
                  borderRadius: '20px', 
                  padding: '5px 15px',
                  fontSize: '14px',
                  opacity: '0.9',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.9'}
              >
                <i className="fas fa-sign-out-alt mr-1"></i> Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;