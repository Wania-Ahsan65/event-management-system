import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function GuestRoute({ children }) {
  const user = useSelector((state) => state.auth.user)
  const location = useLocation()

  if (user) {
    const target = location.state?.from?.pathname || '/'
    return <Navigate to={target} replace />
  }
  return children
}

export default GuestRoute