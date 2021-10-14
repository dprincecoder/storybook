import storyTypes from './story.types'

const INITIALSTATE = {
    stories: [],
    story: {}
}

const storyReducer = (state = INITIALSTATE, action) => {
    switch (action.type) {
        case storyTypes.SET_STORIES:
            return {
                ...state,
                stories: action.payload,
            }
        case storyTypes.SET_STORY:
            return {
                ...state,
                story: action.payload,
            }
        default:
            return state;
    }
}

export default storyReducer;