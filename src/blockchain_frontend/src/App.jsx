import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserPage from './pages/UserPage';
import Features from './pages/Features';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Layout from './Components/Layout';
import Card0 from './Components/Card0';
import Card1 from './Components/Card1';
import Login from './adminpages/Login'; 

import PrivateRoute from './adminpages/PrivateRoute';
import AdminRoute from './adminpages/AdminRoute';
import AdminPage from './adminpages/AdminPage';
import UploadForm from './adminpages/Components/UploadForm';
import Documents from './adminpages/Components/Documents';
import Certificates from './adminpages/Components/Certificates';
import Categories from './adminpages/Components/Categories';
import DashBoard from './adminpages/Components/DashBoard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes  */}
        <Route path='/' element={<Layout />}>
          <Route index element={<UserPage />} />
          <Route path='features' element={<Features />} />
          <Route path='about-us' element={<AboutUs />} />
          <Route path='contact-us' element={<ContactUs />} />
          <Route path='login' element={<Login />} />

          <Route path='card0' element={<Card0 />} />
          <Route path='card1' element={<Card1 />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          </PrivateRoute>
        }>
          <Route index element={<DashBoard />} />
          <Route path="upload" element={<UploadForm />} />
          <Route path="documents" element={<Documents />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="categories" element={<Categories />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;