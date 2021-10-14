import { combineReducers } from "redux";
import userReducer from "./user/user.reducer";
import storyReducer from "./story/story.reducer";

export default combineReducers({
	user: userReducer,
	storiesData: storyReducer,
});
