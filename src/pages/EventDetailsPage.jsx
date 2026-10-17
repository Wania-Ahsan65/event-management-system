import { useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEventById } from '../features/events/eventsSlice'
import { registerForEvent, cancelRegistration } from '../features/registrations/registrationsSlice'
import { showToast } from '../features/ui/uiSlice'
import { formatDate, formatTime, isUpcoming } from '../utils/format'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

function EventDetailsPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const location = useLocation()
  const user = useSelector((s) => s.auth.user)
  const registrations = useSelector((s) => s.registrations.items)
  const { selected: event, selectedStatus: status, selectedError: error } =
    useSelector((s) => s.events)

  useEffect(() => {
    const request = dispatch(fetchEventById(id))
    return () => request.abort()
  }, [dispatch, id])

  if (status === 'loading' || status === 'idle') return <Loader text="Loading event..." />
  if (status === 'failed') {
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchEventById(id))} />
  }
  if (!event) return null

  const isRegistered =
    !!user && registrations.some((r) => r.userId === user.id && r.eventId === event.id)
  const upcoming = isUpcoming(event.localDate)

  const handleRegister = () => {
    if (isRegistered) {
      dispatch(showToast('You are already registered for this event.', 'info'))
      return
    }
    dispatch(registerForEvent(user.id, event))
    dispatch(showToast(`You are registered for "${event.name}".`))
  }

  const handleCancel = () => {
    if (!window.confirm('Cancel your registration for this event?')) return
    dispatch(cancelRegistration({ userId: user.id, eventId: event.id }))
    dispatch(showToast('Registration cancelled.', 'info'))
  }

  const price =
    event.priceMin != null
      ? `${event.currency || ''} ${event.priceMin}${event.priceMax && event.priceMax !== event.priceMin ? ` - ${event.priceMax}` : ''}`
      : 'Not available'

  return (
    <div className="details">
      <Link to="/" className="back-link">&larr; Back to events</Link>

      {event.image && <img className="details-img" src={event.image} alt={event.name} />}

      <div className="details-head">
        {event.category && <span className="badge">{event.category}</span>}
        {event.genre && event.genre !== 'Undefined' && <span className="badge">{event.genre}</span>}
        <h1>{event.name}</h1>
      </div>

      <div className="details-grid">
        <div className="details-box">
          <h3>When</h3>
          <p>{formatDate(event.localDate)}</p>
          <p>{formatTime(event.localTime) || 'Time TBA'}</p>
          {event.status && <p className="muted">Status: {event.status}</p>}
        </div>

        <div className="details-box">
          <h3>Where</h3>
          <p>{event.venueName || 'Venue TBA'}</p>
          <p>{[event.address, event.city, event.country].filter(Boolean).join(', ')}</p>
        </div>

        <div className="details-box">
          <h3>Price</h3>
          <p>{price}</p>
        </div>
      </div>

      {event.info && (
        <div className="details-box">
          <h3>Info</h3>
          <p>{event.info}</p>
        </div>
      )}
      {event.pleaseNote && (
        <div className="details-box">
          <h3>Please note</h3>
          <p>{event.pleaseNote}</p>
        </div>
      )}

      {event.seatmap && (
        <div className="details-box">
          <h3>Seat map</h3>
          <img className="seatmap" src={event.seatmap} alt="Seat map" />
        </div>
      )}

      <div className="register-box">
        {!user && (
          <Link to="/login" state={{ from: location }} className="btn-primary">
            Login to register
          </Link>
        )}
        {user && !upcoming && <p className="muted">This event has already taken place.</p>}
        {user && upcoming && !isRegistered && (
          <button className="btn-primary" onClick={handleRegister}>Register for this event</button>
        )}
        {user && isRegistered && (
          <>
            <span className="registered-tag">&#10003; You are registered</span>
            {upcoming && <button className="btn-danger" onClick={handleCancel}>Cancel registration</button>}
          </>
        )}
      </div>

      {event.url && (
        <a className="btn-outline" href={event.url} target="_blank" rel="noreferrer">
          Buy tickets on Ticketmaster
        </a>
      )}
    </div>
  )
}

export default EventDetailsPage