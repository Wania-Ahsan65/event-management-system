import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { isUpcoming } from '../utils/format'

function Navbar() {
  const user = useSelector((state) => state.auth.user)
  const registrations = useSelector((state) => state.registrations.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const upcomingCount = user
    ? registrations.filter((r) => r.userId === user.id && isUpcoming(r.event.localDate)).length
    : 0

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">EventHub</Link>
      <div className="nav-links">
        <NavLink to="/">Events</NavLink>
        {user ? (
          <>
            <NavLink to="/my-events">
              My Events
              {upcomingCount > 0 && <span className="nav-count">{upcomingCount}</span>}
            </NavLink>
            <span className="user-name">Hi, {user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar