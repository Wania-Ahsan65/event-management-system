import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import eventsReducer from '../features/events/eventsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
  },
})
// Keep the login session in localStorage so it survives a refresh
store.subscribe(() => {
  const { user } = store.getState().auth
  try {
    if (user) localStorage.setItem('em_session', JSON.stringify(user))
    else localStorage.removeItem('em_session')
  } catch { /* storage unavailable */ }
})