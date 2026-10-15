import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetails from './pages/EventDetails';
import MyEvents from './pages/MyEvents';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>{' '}
        <Link to="/login">Login</Link>{' '}
        <Link to="/register">Register</Link>{' '}
        <Link to="/events/1">Event Details</Link>{' '}
        <Link to="/my-events">My Events</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/my-events" element={<MyEvents />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;