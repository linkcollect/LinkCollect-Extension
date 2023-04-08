import { combineReducers } from "redux";
import  authReducers from "./authReducers"

const reducers = combineReducers({
    auth:authReducers
});



export default reducers;