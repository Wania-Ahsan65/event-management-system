import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { searchEvents, getCategories, getEventById } from '../../services/ticketmaster'

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

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id, { rejectWithValue }) => {
    try {
      return await getEventById(id)
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
    selected: null,
    selectedStatus: 'idle',
    selectedError: null,
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
        if (action.meta.aborted) return // cancelled on purpose, not a real error
        state.status = 'failed'
        state.error = action.payload || 'Something went wrong.'
      })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload })

            .addCase(fetchEventById.pending, (state) => {
        state.selectedStatus = 'loading'
        state.selectedError = null
        state.selected = null
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.selectedStatus = 'succeeded'
        state.selected = action.payload
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        if (action.meta.aborted) return
        state.selectedStatus = 'failed'
        state.selectedError = action.payload || 'Could not load this event.'
      })
  },
})

export default eventsSlice.reducer