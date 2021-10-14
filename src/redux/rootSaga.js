import { all, call } from "redux-saga/effects";
import userSagas from "./user/userSagas";
import storySagas from "./story/story.sagas";

export default function* rootSaga() {
	yield all([call(userSagas), call(storySagas)]);
}
