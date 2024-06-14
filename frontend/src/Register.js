// src/Login.js
import React from 'react';
import './Register.css'; 
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet';

const Register = () => {
  return (
    <>
      <Header />
      <section className="Register-pelanggan">
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
        <div className="Register-box">
          <h2>Daftar</h2>
          <form>
            <div className="input-group">
              <label htmlFor="nama-depan">Nama Depan<span className='bintang'>*</span></label>
              <input type="text" id="nama-depan" name="nama-depan" required />
            </div>
            <div className="input-group">
              <label htmlFor="nama-belakang">Nama Belakang<span className='bintang'>*</span></label>
              <input type="text" id="nama-belakang" name="nama-belakang" required />
            </div>
            <div className="input-group">
              <label htmlFor="alamat-email">Alamat Email<span className='bintang'>*</span></label>
              <input type="text" id="alamat-email" name="alamat-email" required />
            </div>
            <div className="input-group">
              <label htmlFor="password">Kata Sandi<span className='bintang'>*</span></label>
              <input type="password" id="password" name="password" required />
            </div>
            <div className="DataPribadi">
              <label>
                <p>Data Pribadi Anda akan digunakan untuk menunjang pengalaman anda di seluruh situs web ini, untuk mengelola akses ke akun anda, dan untuk tujuan lain yang di jelaskan dalam <span className='bintang'>kebiijakan privasi</span> kami.</p>
              </label>
            </div>
            <button type="submit" className='register'>REGISTER</button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Register;
