import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toast: null },
  reducers: {
    showToast: {
      prepare(message, type = 'success') {
        return { payload: { id: Date.now(), message, type } }
      },
      reducer(state, action) {
        state.toast = action.payload
      },
    },
    hideToast(state) {
      state.toast = null
    },
  },
})

export const { showToast, hideToast } = uiSlice.actions
export default uiSlice.reducer