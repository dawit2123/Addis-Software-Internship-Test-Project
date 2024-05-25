import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  musics: [],
  isLoading: false,
  isLoadingState: true,
  isError: "",
};

const musicState = createSlice({
  name: "musics",
  initialState,
  reducers: {
    getMusicsFetch: (state) => {
      state.isLoading = true;
    },
    getMusicsSuccess: (state, action) => {
      state.musics = action.payload;
      state.isLoading = false;
      state.isLoadingState = false;
    },
    addMusic: (state, action) => {
      state.isLoading = true;
      state.isLoadingState = true;
    },
    addMusicSuccess: (state, action) => {
      state.musics.push(action.payload);
      state.isLoading = false;
      state.isLoadingState = false;
    },
    deleteMusic: (state, action) => {
      state.isLoadingState = true;
      state.isLoading = true;
    },
    deleteMusicSuccess: (state, action) => {
      state.isLoading = false;
      state.isLoadingState = false;
    },
    editMusic: (state, action) => {
      state.isLoading = true;
      state.isLoadingState = true;
    },
    editMusicSucces: (state, action) => {
      state.musics = state.musics.map((music) => {
        if (music.id === action.payload._id) {
          return {
            ...music,
            title: action.payload.title,
          };
        }
        return music;
      });

      state.isLoading = false;
      state.isLoadingState = false;
    },
    getMusicError: (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    },
  },
});

export const {
  getMusicsFetch,
  getMusicsSuccess,
  getMusicError,
  addMusic,
  addMusicSuccess,
  editMusic,
  editMusicSucces,
  deleteMusic,
  deleteMusicSuccess,
} = musicState.actions;

export default musicState.reducer;
