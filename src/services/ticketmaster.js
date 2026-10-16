const BASE_URL = 'https://app.ticketmaster.com/discovery/v2'
const API_KEY = import.meta.env.VITE_TM_API_KEY

async function request(path, params = {}) {
  if (!API_KEY) {
    throw new Error('Missing API key. Add VITE_TM_API_KEY to your .env file and restart the dev server.')
  }

  const query = new URLSearchParams({ apikey: API_KEY })
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value)
  })

  const res = await fetch(`${BASE_URL}${path}?${query}`)
  if (res.status === 429) throw new Error('Too many requests. Please wait a moment and try again.')
  if (res.status === 401) throw new Error('Invalid API key. Check VITE_TM_API_KEY in .env.')
  if (!res.ok) throw new Error(`Request failed (${res.status}).`)
  return res.json()
}

// Pick a reasonably sized 16:9 image
function pickImage(images = []) {
  const wide = images.filter((i) => i.ratio === '16_9').sort((a, b) => a.width - b.width)
  return (wide.find((i) => i.width >= 640) || wide[wide.length - 1] || images[0])?.url || null
}

// Flatten the big API object into the fields our app needs
export function mapEvent(e) {
  const venue = e._embedded?.venues?.[0]
  const cls = e.classifications?.[0]
  const price = e.priceRanges?.[0]
  return {
    id: e.id,
    name: e.name,
    url: e.url,
    image: pickImage(e.images),
    localDate: e.dates?.start?.localDate || null,
    localTime: e.dates?.start?.localTime || null,
    dateTime: e.dates?.start?.dateTime || null,
    status: e.dates?.status?.code || null,
    venueName: venue?.name || null,
    address: venue?.address?.line1 || null,
    city: venue?.city?.name || null,
    country: venue?.country?.name || null,
    category: cls?.segment?.name || null,
    genre: cls?.genre?.name || null,
    priceMin: price?.min ?? null,
    priceMax: price?.max ?? null,
    currency: price?.currency || null,
    info: e.info || null,
    pleaseNote: e.pleaseNote || null,
    seatmap: e.seatmap?.staticUrl || null,
  }
}

// params: keyword, classificationName, startDateTime, sort, page, size
export async function searchEvents(params = {}) {
  const data = await request('/events.json', { size: 12, sort: 'date,asc', ...params })
  return {
    events: (data._embedded?.events || []).map(mapEvent), // no results => no _embedded
    page: data.page || { number: 0, totalPages: 0, totalElements: 0 },
  }
}

export async function getEventById(id) {
  const data = await request(`/events/${id}.json`)
  return mapEvent(data)
}

export async function getCategories() {
  const data = await request('/classifications.json', { size: 20 })
  const names = (data._embedded?.classifications || [])
    .map((c) => c.segment?.name)
    .filter(Boolean)
  return [...new Set(names)]
}