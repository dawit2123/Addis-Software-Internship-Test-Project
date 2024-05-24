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
import { all, fork } from "redux-saga/effects";

const saga = createSagaMiddleware();

function* rootSaga() {
  yield all([
    fork(musicSaga),
    fork(addMusicSaga),
    fork(editMusicSaga),
    fork(deleteMusicSaga),
  ]);
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
