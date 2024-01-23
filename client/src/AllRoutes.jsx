import React from 'react'
import Home from './pages/Home'
import { Route,Routes,Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import AdminPanel from './pages/Admin/AdminPanel'
import Getusers from './pages/Admin/Getusers'

function AllRoutes() {
  const authtoken=localStorage.getItem('authtoken')
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path="/admin" element={authtoken ? <AdminPanel /> : <Navigate to='/login' />} />
        <Route
          path="/admin/getusers/:org_name/:org_code"
          element={authtoken ? <Getusers /> : <Navigate to='/login' />}
        />
    </Routes>
  )
}

export default AllRoutes