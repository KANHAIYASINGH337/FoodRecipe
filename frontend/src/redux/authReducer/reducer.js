import {
  AUTH_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  SIGNUP_SUCCESS,
  LOGOUT_SUCCESS,
} from "./actionTypes";

const savedToken = localStorage.getItem("token") || "";
const savedUser = JSON.parse(localStorage.getItem("user") || "null");

const initialState = {
  isAuth: !!savedToken,
  token: savedToken,
  loggedInUser: savedUser,
  isLoading: false,
  isError: false,
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case AUTH_LOADING:
      return { ...state, isLoading: true, isError: false };

    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuth: true,
        token: payload.token,
        loggedInUser: payload.user,
      };

    case SIGNUP_SUCCESS:
      return { ...state, isLoading: false, isError: false };

    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuth: false,
        token: "",
        loggedInUser: null,
      };

    case AUTH_ERROR:
      return { ...state, isLoading: false, isError: true };

    default:
      return state;
  }
};