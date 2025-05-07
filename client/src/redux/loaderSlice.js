import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
  name: 'loader',
  initialState: false, // Le loader est initialement masqué (false)
  reducers: {
    showLoader: (state) => true, // Action pour afficher le loader
    hideLoader: (state) => false, // Action pour masquer le loader
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;

export default loaderSlice.reducer;
