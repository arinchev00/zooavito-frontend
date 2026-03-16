import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../api/auth';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);
      const { token, user } = response.data;
      
      console.log('Данные пользователя:', user);
      
      authLogin(token, {
        id: user.id,
        fullName: user.fullName,
        phone: user.telephoneNumber,
        role: user.roles?.[0] || 'USER',
        email: user.email
      });
      
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response data:', error.response?.data);
      
      // Проверяем наличие сообщения в ответе
      if (error.response?.data) {
        // Проверяем поле account (оно приходит с бэкенда)
        if (error.response.data.account) {
          setError(error.response.data.account);
        }
        // Проверяем поле message
        else if (error.response.data.message) {
          setError(error.response.data.message);
        }
        // Если это строка
        else if (typeof error.response.data === 'string') {
          setError(error.response.data);
        }
        // Если ничего не нашли
        else {
          setError('Ошибка при входе. Проверьте email и пароль.');
        }
      } else {
        setError('Ошибка при входе. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="auth-form-container">
            <h2 className="auth-title">Вход в систему</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Электронная почта</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Введите электронную почту"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Введите пароль"
                  required
                />
              </div>

              <button 
                className="btn btn-primary btn-block mt-4" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Вход...' : 'Войти'}
              </button>

              <div className="auth-footer">
                <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;