// downloadSlice.js
import { createSlice } from '@reduxjs/toolkit';

const downloadSlice = createSlice({
    name: 'downloads',
    initialState: {
        open: false,
        files: []
    },
    reducers: {
        toggleMenu: (state, action) => {
            state.open = action.payload.open || false;
        },
        addDownload: (state, action) => {
            const file = state?.files.find(f => f.id === action.payload.id);
            state.open = action?.payload?.open || true;
            if (!file) {
                state.files = [action.payload].concat(state.files);
            }
        },
        downloadSuccessful: (state, action) => {
            const file = state?.files.find(f => f.id === action.payload.id);
            if (file) {
                file.progress = action.payload.progress;
                file.link = action.payload?.link || '#';
            }
        },
        updateDownloadProgress: (state, action) => {
            const file = state?.files.find(f => f.id === action.payload.id);
            if (file) {
                file.progress = action.payload.progress;
            }
        },
    },
});

export const { addDownload, updateDownloadProgress, toggleMenu, downloadSuccessful } = downloadSlice.actions;

export default downloadSlice.reducer;
