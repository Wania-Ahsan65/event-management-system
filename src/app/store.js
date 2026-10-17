import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import eventsReducer from '../features/events/eventsSlice'
import registrationsReducer from '../features/registrations/registrationsSlice'
import uiReducer from '../features/ui/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
    ui: uiReducer,
  },
})

// Persist the login session and registrations in localStorage
let lastUser = store.getState().auth.user
let lastRegs = store.getState().registrations.items

store.subscribe(() => {
  const state = store.getState()
  try {
    if (state.auth.user !== lastUser) {
      lastUser = state.auth.user
      if (lastUser) localStorage.setItem('em_session', JSON.stringify(lastUser))
      else localStorage.removeItem('em_session')
    }
    if (state.registrations.items !== lastRegs) {
      lastRegs = state.registrations.items
      localStorage.setItem('em_registrations', JSON.stringify(lastRegs))
    }
  } catch { /* storage unavailable */ }
})