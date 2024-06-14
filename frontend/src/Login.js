// src/Login.js
import React from 'react';
import './Login.css'; 
import Header from './Header';
import Footer from './Footer';
import Register from './Register';
import { Helmet } from 'react-helmet';
import DashboardSA from './DashboardSA';
import DashboardA from './DashboardA';

const Login = () => {
  return (
    <>
      <Header />
      <section className="login-pelanggan">
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
        <div className="login-box">
          <h2>Masuk</h2>
          <form>
            <div className="input-group">
              <label htmlFor="username">Nama pengguna atau alamat email<span className='bintang'>*</span></label>
              <input type="text" id="username" name="username" required />
            </div>
            <div className="input-group">
              <label htmlFor="password">Kata Sandi<span className='bintang'>*</span></label>
              <input type="password" id="password" name="password" required />
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" name="remember" /> Ingat saya
              </label>
              <a href="/ForgotPassword">Forgot Password?</a>
            </div>
            <button type="submit" className='masuk'>MASUK</button>
          </form>
          <div className="register-link">
            <a href="/register">Register Now!</a>
          </div>
          <div className="register-link">
            <a href="/DashboardSA">Login Super Admin</a>
          </div>
          <div className="register-link">
            <a href="/DashboardA">Login Admin</a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;
