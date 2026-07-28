import axios from "axios";
import {
  ADDRECIPE_ERROR,
  ADDRECIPE_LOADING,
  ADDRECIPE_SUCCESS,
  GET_FEED_ERROR,
  GET_FEED_LOADING,
  GET_FEED_SUCCESS,
} from "./actionTypes";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

// GET ALL RECIPES
export const getAllRecipes = (queryParams = {}) => async (dispatch) => {
  dispatch({ type: GET_FEED_LOADING });
  try {
    const res = await axios.get(`${API}/api/recipes`, { params: queryParams });
    dispatch({ type: GET_FEED_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: GET_FEED_ERROR });
  }
};

// GET MY RECIPES
export const getMyRecipes = (token) => async (dispatch) => {
  dispatch({ type: GET_FEED_LOADING });
  try {
    const res = await axios.get(`${API}/api/recipes/my-recipes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: GET_FEED_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: GET_FEED_ERROR });
  }
};

// ADD RECIPE
export const addNewRecipe =
  (token, recipe, toast, navigate, closeModal) => async (dispatch) => {
    dispatch({ type: ADDRECIPE_LOADING });
    try {
      const res = await axios.post(`${API}/api/recipes`, recipe, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: ADDRECIPE_SUCCESS, payload: res.data });
      toast({
        title: "Recipe Added!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if (closeModal) closeModal();
      if (navigate) navigate("/explore");
    } catch (err) {
      dispatch({ type: ADDRECIPE_ERROR });
      toast({
        title: "Failed to add recipe",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

// EDIT RECIPE
export const editRecipe =
  (id, token, updatedData, toast) => async (dispatch) => {
    try {
      await axios.patch(`${API}/api/recipes/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(getMyRecipes(token));
      toast({
        title: "Recipe Updated!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to update recipe",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

// DELETE RECIPE
export const deleteRecipe = (id, token, toast) => async (dispatch) => {
  try {
    await axios.delete(`${API}/api/recipes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(getMyRecipes(token));
    toast({
      title: "Recipe Deleted!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  } catch (err) {
    toast({
      title: "Failed to delete recipe",
      description: err.response?.data?.message || "Something went wrong",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

// LIKE RECIPE
export const likeRecipe = (id, token) => async (dispatch) => {
  try {
    await axios.patch(
      `${API}/api/recipes/like/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(getAllRecipes());
  } catch (err) {
    console.log("Like failed", err);
  }
};