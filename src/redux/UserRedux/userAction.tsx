import { createAction } from '@reduxjs/toolkit';

export const setisLoggedIn = createAction<any>('SET_PAGE_JSON');

export const setLoginErrMsg = createAction<any>('SET_LOGIN_ERROR_MESSAGE');

export const setUserDetails = createAction<any>('SET_USER_DETAILS');

export const setUsername = createAction<any>('SET_USERNAME');

export const setUserData = createAction<any>('SET_USERDATA');

export const setCartWidgets = createAction<any>('SET_CARTWIDGETS');

export const setPurchasedWidgets = createAction<any>('SET_PURCHASED_WIDGETS');

export const setIsEmailVerified = createAction<any>('SET_IS_EMAIL_VERIFIED');