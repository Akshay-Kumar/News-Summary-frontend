// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import NewsList from './components/NewsList';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Bookmarks from './components/Bookmarks';
import Logout from './components/Logout';
import AdminWorldNewsList from './components/AdminWorldNewsList';
import AdminJobDashboard from './components/AdminJobDashboard';


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
          <Route path="/admin_worldnews" element={<AdminWorldNewsList />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/admin_job_dashboard" element={<AdminJobDashboard/>}/>
        </Routes>
      </div>
  );
}

export default App;
