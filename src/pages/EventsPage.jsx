import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents, fetchCategories } from '../features/events/eventsSlice'
import useDebounce from '../hooks/useDebounce'
import EventCard from '../components/EventCard'
import SearchBar from '../components/SearchBar'
import CategoryBar from '../components/CategoryBar'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

const SIZE = 12
const MAX_RESULTS = 1000 // the API refuses to page past ~1000 results

// the API wants dates like 2026-10-17T10:00:00Z (no milliseconds)
const toApiDate = (d) => d.toISOString().split('.')[0] + 'Z'

function EventsPage() {
  const dispatch = useDispatch()
  const { items, page: pageInfo, status, error, categories } = useSelector((s) => s.events)

  const [tab, setTab] = useState('all') // all | upcoming
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(0)

  const debouncedKeyword = useDebounce(keyword)
  const debouncedCity = useDebounce(city)

  // any filter change sends the user back to page 1
  const change = (setter) => (value) => {
    setter(value)
    setPage(0)
  }

  const params = useMemo(() => {
    const p = { page, size: SIZE }
    if (debouncedKeyword.trim()) p.keyword = debouncedKeyword.trim()
    if (category) p.classificationName = category
    if (debouncedCity.trim()) p.city = debouncedCity.trim()

    if (tab === 'upcoming') {
      const now = new Date()
      const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      p.sort = 'date,asc'
      p.startDateTime = toApiDate(now)
      p.endDateTime = toApiDate(in30)
    } else {
      p.sort = 'relevance,desc'
    }
    // an explicit date range overrides the tab's range
    if (startDate) p.startDateTime = `${startDate}T00:00:00Z`
    if (endDate) p.endDateTime = `${endDate}T23:59:59Z`
    return p
  }, [page, debouncedKeyword, category, debouncedCity, tab, startDate, endDate])

  useEffect(() => {
    if (categories.length > 0) return // already loaded
    const t = setTimeout(() => dispatch(fetchCategories()), 800) // stay under 2 requests/sec
    return () => clearTimeout(t)
  }, [dispatch, categories.length])

  useEffect(() => {
    const request = dispatch(fetchEvents(params))
    return () => request.abort() // ignore outdated responses
  }, [dispatch, params])

  const clearFilters = () => {
    setKeyword(''); setCategory(''); setCity('')
    setStartDate(''); setEndDate(''); setTab('all'); setPage(0)
  }

  const totalPages = Math.min(pageInfo.totalPages, Math.floor(MAX_RESULTS / SIZE))

  return (
    <div>
      <h1>Explore events</h1>

      <div className="tabs">
        <button className={tab === 'all' ? 'tab active' : 'tab'} onClick={() => change(setTab)('all')}>
          All events
        </button>
        <button className={tab === 'upcoming' ? 'tab active' : 'tab'} onClick={() => change(setTab)('upcoming')}>
          Upcoming (30 days)
        </button>
      </div>

      <SearchBar value={keyword} onChange={change(setKeyword)} />
      <CategoryBar categories={categories} selected={category} onSelect={change(setCategory)} />

      <div className="filters">
        <input placeholder="City" value={city} onChange={(e) => change(setCity)(e.target.value)} aria-label="City" />
        <label>From <input type="date" value={startDate} onChange={(e) => change(setStartDate)(e.target.value)} /></label>
        <label>To <input type="date" value={endDate} onChange={(e) => change(setEndDate)(e.target.value)} /></label>
        <button className="link-btn" onClick={clearFilters}>Clear filters</button>
      </div>

      {status === 'loading' && <Loader text="Loading events..." />}
      {status === 'failed' && <ErrorMessage message={error} onRetry={() => dispatch(fetchEvents(params))} />}

      {status === 'succeeded' && (
        <>
          <p className="muted">{pageInfo.totalElements} events found</p>
          {items.length === 0 ? (
            <p className="empty">No events match your search. Try changing the filters.</p>
          ) : (
            <div className="event-grid">
              {items.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}

export default EventsPage