import { combineReducers } from "redux";
// @ts-ignore
import { popupReducer } from "./PopupRedux/popup-reducer.tsx";
import { userReducer } from "./UserRedux/user-reducer";

const rootReducer = combineReducers({
  popup: popupReducer,
  user: userReducer
});

export default rootReducer;