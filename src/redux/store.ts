import { legacy_createStore, compose, applyMiddleware, ActionCreator, Action } from "redux";
// @ts-ignore
import rootReducer from "./rootReducer";
import thunk, { ThunkAction, ThunkDispatch, ThunkMiddleware } from "redux-thunk";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose || compose;
// const composeEnhancer = compose;

export type AppState = ReturnType<typeof rootReducer>

export const store = legacy_createStore(rootReducer,
  composeEnhancer(applyMiddleware(thunk))
);

export type AppDispatch = typeof store.dispatch;

// export type AppThunk = ActionCreator<
//   ThunkAction<void, ApplicationState, null, Action<string>>
// >;

export default store;

