import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import comiReducer from "./Reducers";

export const store = createStore(comiReducer, {}, applyMiddleware(thunk));
