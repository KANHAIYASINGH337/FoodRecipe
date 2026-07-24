import {
  ADDRECIPE_ERROR,
  ADDRECIPE_LOADING,
  ADDRECIPE_SUCCESS,
  GET_FEED_ERROR,
  GET_FEED_LOADING,
  GET_FEED_SUCCESS,
} from "./actionTypes";

const initialState = {
  recipes: [],
  isLoading: false,
  isError: false,
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADDRECIPE_LOADING:
    case GET_FEED_LOADING:
      return { ...state, isLoading: true, isError: false };

    case GET_FEED_SUCCESS:
      return { ...state, isLoading: false, recipes: payload };

    case ADDRECIPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        recipes: [payload, ...state.recipes],
      };

    case ADDRECIPE_ERROR:
    case GET_FEED_ERROR:
      return { ...state, isLoading: false, isError: true };

    default:
      return state;
  }
};