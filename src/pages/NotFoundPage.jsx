import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="center">
      <h1>Page not found</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary">Back to events</Link>
    </div>
  )
}

export default NotFoundPage