import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const USERS_KEY = 'em_users'     // all registered accounts (simulated database)
const SESSION_KEY = 'em_session' // currently logged-in user

const readJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    const users = readJSON(USERS_KEY, [])
    const normalized = email.trim().toLowerCase()

    if (users.some((u) => u.email === normalized)) {
      return rejectWithValue('An account with this email already exists.')
    }

    const newUser = { id: crypto.randomUUID(), name: name.trim(), email: normalized, password }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]))
    return { id: newUser.id, name: newUser.name, email: newUser.email }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    const users = readJSON(USERS_KEY, [])
    const found = users.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    )
    if (!found) return rejectWithValue('Invalid email or password.')
    return { id: found.id, name: found.name, email: found.email }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: readJSON(SESSION_KEY, null), // restores login after refresh
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(registerUser.fulfilled, (state, action) => { state.status = 'idle'; state.user = action.payload })
      .addCase(registerUser.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload })
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => { state.status = 'idle'; state.user = action.payload })
      .addCase(loginUser.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer