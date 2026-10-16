import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents } from '../features/events/eventsSlice'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

function EventsPage() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.events)

  const load = () => dispatch(fetchEvents({ countryCode: 'US' }))

  useEffect(() => {
    load()
  }, [])

  if (status === 'loading') return <Loader text="Loading events..." />
  if (status === 'failed') return <ErrorMessage message={error} onRetry={load} />

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {items.map((e) => (
          <li key={e.id}>{e.name} | {e.localDate} | {e.venueName}, {e.city}</li>
        ))}
      </ul>
    </div>
  )
}

export default EventsPage