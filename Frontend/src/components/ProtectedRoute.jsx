import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from "react-redux"

const ProtectedRoute = ({ children }) => {
  const authenticated = useSelector((state) => state.user.isAuthenticated);

  if ( !authenticated ){
    return <Navigate to='/auth' />
  }
  else{
    return children
  }
}

export default ProtectedRoute