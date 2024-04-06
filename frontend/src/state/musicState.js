import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  musics: [],
  isLoading: false,
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
    },
    addMusic: (state, action) => {
      state.isLoading = true;
    },
    addMusicSuccess: (state, action) => {
      state.musics.push(action.payload);
      state.isLoading = false;
    },
    deleteMusic: (state, action) => {
      state.isLoading = true;
    },
    deleteMusicSuccess: (state, action) => {
      state.isLoading = false;
    },
    editMusic: (state, action) => {
      state.isLoading = true;
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
