import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEventById } from '../features/events/eventsSlice'
import { formatDate, formatTime } from '../utils/format'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

function EventDetailsPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
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

      {/* Phase 8 adds the Register button here */}

      {event.url && (
        <a className="btn-outline" href={event.url} target="_blank" rel="noreferrer">
          Buy tickets on Ticketmaster
        </a>
      )}
    </div>
  )
}

export default EventDetailsPage