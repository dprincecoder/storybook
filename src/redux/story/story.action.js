import storyTypes from "./story.types";

export const addStoryStart = (storyData) => ({
	type: storyTypes.ADD_NEW_STORY_START,
	payload: storyData,
});

export const fetchStoriesStart = (filters = {}) => ({
	type: storyTypes.FETCH_STORIES_START,
	payload: filters,
});

export const setStories = (stories) => ({
	type: storyTypes.SET_STORIES,
	payload: stories,
});

export const deleteStoryStart = (storyID) => ({
	type: storyTypes.DELETE_STORY_START,
	payload: storyID,
});

export const fetchStoryStart = (storyID) => ({
	type: storyTypes.FETCH_STORY_START,
	payload: storyID,
});

export const setStory = (story) => ({
	type: storyTypes.SET_STORY,
	payload: story,
});

// export const fetchUserStoriesStart = (filters = {}) => ({
// 	type: storyTypes.FETCH_USER_STORIES_START,
// 	payload: filters,
// });

export const fetchUserStoriesStart = (userId) => ({
	type: storyTypes.FETCH_USER_STORIES_START,
	payload: userId,
});
