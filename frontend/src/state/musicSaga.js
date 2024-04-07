import { call, put, takeEvery } from "redux-saga/effects";
import {
  addMusicSuccess,
  deleteMusicSuccess,
  editMusicSucces,
  getMusicsSuccess,
} from "./musicState";
import axios from "axios";

function* GetMusicsFetch() {
  const musics = yield call(() =>
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/music`)
  );
  const formattedMusic = yield musics.json();
  yield put(getMusicsSuccess(formattedMusic));
}

function* AddMusic(action) {
  try {
    const res = yield call(() =>
      axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/music/`,
        action.payload
      )
    );
    yield put(addMusicSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
}
function* DeleteMusic(action) {
  try {
    yield call(() =>
      axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/music/${action.payload}`
      )
    );
    yield put(deleteMusicSuccess());
  } catch (error) {
    console.log(error);
  }
}

function* EditMusic(action) {
  try {
    const res = yield call(() => {
      return axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/music/${action.payload.id}`,
        action.payload
      );
    });
    yield put(editMusicSucces(res.data));
  } catch (error) {
    console.log(error);
  }
}

function* musicSaga() {
  yield takeEvery("musics/getMusicsFetch", GetMusicsFetch);
}

function* addMusicSaga() {
  yield takeEvery("musics/addMusic", AddMusic);
}

function* editMusicSaga() {
  yield takeEvery("musics/editMusic", EditMusic);
}
function* deleteMusicSaga() {
  yield takeEvery("musics/deleteMusic", DeleteMusic);
}

export { musicSaga, addMusicSaga, editMusicSaga, deleteMusicSaga };
