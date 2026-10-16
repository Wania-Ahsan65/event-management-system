import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { searchEvents, getCategories } from '../../services/ticketmaster'

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params, { rejectWithValue }) => {
    try {
      return await searchEvents(params)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'events/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await getCategories()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    page: { number: 0, totalPages: 0, totalElements: 0 },
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    categories: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.events
        state.page = action.payload.page
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Something went wrong.'
      })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload })
  },
})

export default eventsSlice.reducer