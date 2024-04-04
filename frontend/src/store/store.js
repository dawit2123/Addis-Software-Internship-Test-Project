import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import musicReducer from "../state/musicState";
import generalReducer from "../state/generalState";
import {
  addMusicSaga,
  deleteMusicSaga,
  editMusicSaga,
  musicSaga,
} from "../state/musicSaga";
import { all } from "redux-saga/effects";

const saga = createSagaMiddleware();

function* rootSaga() {
  yield all([musicSaga(), addMusicSaga(), editMusicSaga(), deleteMusicSaga()]);
}

const store = configureStore({
  reducer: {
    musics: musicReducer,
    general: generalReducer,
  },
  middleware: [saga],
});

saga.run(rootSaga);

export default store;
