import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";
import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga'

const sagaMiddleware = createSagaMiddleware();
export const middleware = [thunk, sagaMiddleware, logger]

//create store enhancer
const store = createStore(rootReducer, applyMiddleware(...middleware));
sagaMiddleware.run(rootSaga)

export default store;