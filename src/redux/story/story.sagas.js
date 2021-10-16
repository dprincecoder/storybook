import { auth } from "../../firebase/functions";
import { takeLatest, put, all, call } from "redux-saga/effects";
import storyTypes from "./story.types";
import { setStories, fetchStoriesStart, setStory } from "./story.action";
import {
	handleAddStory,
	handleFetchStories,
	handleFetchStory,
	handleFetchUserStories,
} from "./story.helpers";

export function* addStory({ payload }) {
	try {
		let today = new Date();
		let timestamp = today.toISOString();
		yield handleAddStory({
			...payload,
			storyUserUID: auth.currentUser.uid,
			createdDate: timestamp,
			liked: false,
			likeCount: 0,
		});
		yield put(fetchStoriesStart());
	} catch (error) {
		console.log("this error occured while adding story", error);
	}
}

export function* onAddStoryStart() {
	yield takeLatest(storyTypes.ADD_NEW_STORY_START, addStory);
}

export function* fetchStories({ payload }) {
	try {
		const stories = yield handleFetchStories(payload);
		yield put(setStories(stories));
	} catch (error) {
		console.log("this error occured while fetching stories", error);
	}
}

export function* onFetchStoriesStart() {
	yield takeLatest(storyTypes.FETCH_STORIES_START, fetchStories);
}

export function* fetchStory({ payload }) {
	try {
		const story = yield handleFetchStory(payload);
		yield put(setStory(story));
	} catch (error) {
		console.log("this error occured while fetching single story", error);
	}
}

export function* onFetchStoryStart() {
	yield takeLatest(storyTypes.FETCH_STORY_START, fetchStory);
}

export function* fetchUserStories({ payload }) {
	try {
		const stories = yield handleFetchUserStories(payload);
		yield put(setStories(stories));
	} catch (error) {
		console.log("this error occured while user fetching stories", error);
	}
}

export function* onFetchUserStoriesStart() {
	yield takeLatest(storyTypes.FETCH_USER_STORIES_START, fetchUserStories);
}

export default function* storySagas() {
	yield all([
		call(onAddStoryStart),
		call(onFetchStoriesStart),
		call(onFetchStoryStart),
		call(onFetchUserStoriesStart),
	]);
}
