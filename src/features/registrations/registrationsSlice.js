import { createSlice } from '@reduxjs/toolkit'

const KEY = 'em_registrations'

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? []
  } catch {
    return []
  }
}

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: { items: load() },
  reducers: {
    registerForEvent: {
      // prepare() creates the random id and timestamp, so the reducer stays pure
      prepare(userId, event) {
        return {
          payload: {
            id: crypto.randomUUID(),
            userId,
            eventId: event.id,
            registeredAt: new Date().toISOString(),
            // snapshot: My Events still works after the event leaves the API
            event: {
              id: event.id,
              name: event.name,
              image: event.image,
              localDate: event.localDate,
              localTime: event.localTime,
              venueName: event.venueName,
              city: event.city,
              category: event.category,
            },
          },
        }
      },
      reducer(state, action) {
        const { userId, eventId } = action.payload
        const exists = state.items.some((r) => r.userId === userId && r.eventId === eventId)
        if (exists) return // duplicate registration is blocked here too
        state.items.push(action.payload)
      },
    },
    cancelRegistration(state, action) {
      const { userId, eventId } = action.payload
      state.items = state.items.filter((r) => !(r.userId === userId && r.eventId === eventId))
    },
  },
})

export const { registerForEvent, cancelRegistration } = registrationsSlice.actions
export default registrationsSlice.reducer