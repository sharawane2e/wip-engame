import { combineReducers } from "redux";
import { emailReducer } from "./EmailProcessRedux/emailprocess-reducer";
import { popupReducer } from "./PopupRedux/popup-reducer";
import { userReducer } from "./UserRedux/user-reducer";

const rootReducer = combineReducers({
  popup: popupReducer,
  user: userReducer,
  email: emailReducer
});

export default rootReducer;