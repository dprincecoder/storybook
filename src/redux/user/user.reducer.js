import userTypes from "./user.types";

const INITIALSTATE = {
	currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
	userError: [],
	userSuccess: [],
	userData: {},
	resetPasswordSuccess: false,
};

const userReducer = (state = INITIALSTATE, action) => {
	switch (action.type) {
		case userTypes.SIGN_IN_SUCCESS:
			return {
				...state,
				currentUser: action.payload,
				userError: [],
			};
		case userTypes.USER_ERROR:
			return {
				...state,
				userError: action.payload,
			};
		case userTypes.USER_SUCCESS:
			return {
				...state,
				userSuccess: action.payload,
			};
		case userTypes.RESET_PASSWORD_SUCCESS:
			return {
				...state,
				resetPasswordSuccess: action.payload,
			};
		case userTypes.SET_USER_DATA:
			return {
				...state,
				userData: action.payload,
			};
		case userTypes.RESET_USER_STATE:
		case userTypes.SIGN_OUT_USER_SUCCESS:
			return {
				...state,
				...INITIALSTATE,
			};
		default:
			return state;
	}
};

export default userReducer;
