// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import NewsList from './components/NewsList';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Bookmarks from './components/Bookmarks';

function App() {
  return (
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<NewsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
        </Routes>
      </div>
  );
}

export default App;
