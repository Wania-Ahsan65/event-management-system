import { Link } from 'react-router-dom'
import { formatDate, formatTime } from '../utils/format'

function RegisteredEventCard({ registration, completed, onCancel }) {
  const { event, registeredAt } = registration

  return (
    <div className={completed ? 'my-card my-card-done' : 'my-card'}>
      <Link to={`/events/${event.id}`} className="my-card-link">
        {event.image ? (
          <img src={event.image} alt={event.name} loading="lazy" />
        ) : (
          <div className="event-card-noimg">No image</div>
        )}
      </Link>

      <div className="my-card-body">
        <div>
          {event.category && <span className="badge">{event.category}</span>}
          <span className={completed ? 'status-tag done' : 'status-tag upcoming'}>
            {completed ? 'Completed' : 'Upcoming'}
          </span>
        </div>

        <h3><Link to={`/events/${event.id}`}>{event.name}</Link></h3>
        <p className="muted">{formatDate(event.localDate)} {formatTime(event.localTime)}</p>
        <p className="muted">
          {[event.venueName, event.city].filter(Boolean).join(', ') || 'Venue TBA'}
        </p>
        <p className="muted small">
          Registered on {new Date(registeredAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </p>

        {!completed && (
          <button className="btn-danger btn-small" onClick={() => onCancel(registration)}>
            Cancel registration
          </button>
        )}
      </div>
    </div>
  )
}

export default RegisteredEventCard