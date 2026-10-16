import { Link } from 'react-router-dom'
import { formatDate, formatTime } from '../utils/format'

function EventCard({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="event-card">
      {event.image ? (
        <img src={event.image} alt={event.name} loading="lazy" />
      ) : (
        <div className="event-card-noimg">No image</div>
      )}
      <div className="event-card-body">
        {event.category && <span className="badge">{event.category}</span>}
        <h3>{event.name}</h3>
        <p className="muted">
          {formatDate(event.localDate)} {formatTime(event.localTime)}
        </p>
        <p className="muted">
          {[event.venueName, event.city].filter(Boolean).join(', ') || 'Venue TBA'}
        </p>
      </div>
    </Link>
  )
}

export default EventCard