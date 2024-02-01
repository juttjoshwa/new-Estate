import { combineReducers } from "redux";
import Reducer from "./Reducers";
import ModeReducer from "./ModeReducer";

const comiReducer = combineReducers({
    amount : Reducer,
    modeChange :ModeReducer
});

export default comiReducer;
