import { auth } from "../../firebase/functions";
import { takeLatest, put, all, call } from "redux-saga/effects";
import storyTypes from "./story.types";
import { setStories, fetchStoriesStart, setStory } from "./story.action";
import {
	handleAddComment,
	handleAddStory,
	handleDeleteStory,
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
			likeCount: 0,
			commentCount: 0,
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
		console.log("this error occured while fetching user stories", error);
	}
}

export function* onFetchUserStoriesStart() {
	yield takeLatest(storyTypes.FETCH_USER_STORIES_START, fetchUserStories);
}

export function* deleteStory({ payload }) {
	try {
		yield handleDeleteStory(payload);
		yield put(fetchStoriesStart());
	} catch (error) {
		console.log("Failed to delete story");
	}
}

export function* onDeleteStoryStart() {
	yield takeLatest(storyTypes.DELETE_STORY_START, deleteStory);
}

export function* addComment({ payload }) {
	try {
		let today = new Date();
		let timestamp = today.toISOString();
		yield handleAddComment({
			...payload,
			createdDate: timestamp,
			likeCount: 0,
			replyCount: 0,
		});
	} catch (error) {
		console.log("this error occured while adding comment", error);
	}
}

export function* onAddCommentStart() {
	yield takeLatest(storyTypes.ADD_NEW_COMMENT_START, addComment);
}

export default function* storySagas() {
	yield all([
		call(onAddStoryStart),
		call(onFetchStoriesStart),
		call(onFetchStoryStart),
		call(onFetchUserStoriesStart),
		call(onDeleteStoryStart),
		call(onAddCommentStart),
	]);
}
