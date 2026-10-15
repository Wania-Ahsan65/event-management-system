import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">EventHub</Link>
      <div className="nav-links">
        <NavLink to="/">Events</NavLink>
        <NavLink to="/my-events">My Events</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </div>
    </nav>
  )
}

export default Navbar