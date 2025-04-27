import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'

const PrivateRoute = () => {
    const currentUser = useSelector((state)=> state.currentUser.data)
  return currentUser ? <Outlet /> : <Navigate to={'/user/login'}/>;
}

export default PrivateRoute