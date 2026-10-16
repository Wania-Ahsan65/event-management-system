import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user)
  const location = useLocation()

  if (!user) {
    // remember where the user wanted to go, so we can send them back after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export default ProtectedRoute