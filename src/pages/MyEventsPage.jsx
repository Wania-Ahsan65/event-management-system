import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cancelRegistration } from '../features/registrations/registrationsSlice'
import { showToast } from '../features/ui/uiSlice'
import { isUpcoming } from '../utils/format'
import RegisteredEventCard from '../components/RegisteredEventCard'

// events with no date sort to the end of "upcoming"
const dateKey = (r) => r.event.localDate || '9999-12-31'

function MyEventsPage() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const allRegistrations = useSelector((s) => s.registrations.items)

  // only this user's registrations, split into upcoming and completed
  const { upcoming, completed } = useMemo(() => {
    const mine = allRegistrations.filter((r) => r.userId === user.id)
    return {
      upcoming: mine
        .filter((r) => isUpcoming(r.event.localDate))
        .sort((a, b) => dateKey(a).localeCompare(dateKey(b))),
      completed: mine
        .filter((r) => !isUpcoming(r.event.localDate))
        .sort((a, b) => dateKey(b).localeCompare(dateKey(a))),
    }
  }, [allRegistrations, user.id])

  const handleCancel = (registration) => {
    if (!window.confirm(`Cancel your registration for "${registration.event.name}"?`)) return
    dispatch(cancelRegistration({ userId: user.id, eventId: registration.eventId }))
    dispatch(showToast('Registration cancelled.', 'info'))
  }

  if (upcoming.length === 0 && completed.length === 0) {
    return (
      <div>
        <h1>My Events</h1>
        <p className="empty">You have not registered for any events yet.</p>
        <p className="center"><Link to="/" className="btn-primary">Browse events</Link></p>
      </div>
    )
  }

  return (
    <div>
      <h1>My Events</h1>

      <section>
        <h2>Upcoming ({upcoming.length})</h2>
        {upcoming.length === 0 ? (
          <p className="muted">No upcoming events. <Link to="/">Find one</Link>.</p>
        ) : (
          <div className="my-list">
            {upcoming.map((r) => (
              <RegisteredEventCard key={r.id} registration={r} completed={false} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Completed ({completed.length})</h2>
        {completed.length === 0 ? (
          <p className="muted">No completed events yet.</p>
        ) : (
          <div className="my-list">
            {completed.map((r) => (
              <RegisteredEventCard key={r.id} registration={r} completed={true} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default MyEventsPage