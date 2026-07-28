import axios from "axios";
import {
  AUTH_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  SIGNUP_SUCCESS,
  LOGOUT_SUCCESS,
} from "./actionTypes";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

// LOGIN USER
export const loginUser = (userObj, toast, navigate) => async (dispatch) => {
  dispatch({ type: AUTH_LOADING });
  try {
    const res = await axios.post(`${API}/api/auth/login`, userObj);
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    dispatch({ type: LOGIN_SUCCESS, payload: { token, user } });

    toast({
      title: "Login Successful",
      description: `Welcome back, ${user.name}!`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/explore");
    }
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
    toast({
      title: "Login Failed",
      description: err.response?.data?.message || "Invalid credentials",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

// CREATE / SIGNUP USER
export const createUser = (userObj, toast, navigate) => async (dispatch) => {
  dispatch({ type: AUTH_LOADING });
  try {
    await axios.post(`${API}/api/auth/signup`, userObj);
    dispatch({ type: SIGNUP_SUCCESS });

    toast({
      title: "Account Created Successfully!",
      description: "Please log in with your new account credentials",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    navigate("/login");
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
    toast({
      title: "Signup Failed",
      description: err.response?.data?.message || "Failed to create account",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

// LOGOUT USER
export const logoutUser = (toast, navigate) => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  dispatch({ type: LOGOUT_SUCCESS });

  if (toast) {
    toast({
      title: "Logged Out Successfully",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  }

  if (navigate) {
    navigate("/login");
  }
};

// GET USER DATA
export const getUserData = (token) => async (dispatch) => {
  dispatch({ type: AUTH_LOADING });
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      dispatch({ type: LOGIN_SUCCESS, payload: { token, user } });
    }
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

// GET USER RECIPES
export const getUserRecipes = (userId, token) => async (dispatch) => {
  try {
    const res = await axios.get(`${API}/api/recipes/my-recipes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: "GET_FEED_SUCCESS", payload: res.data });
  } catch (err) {
    console.log("Error getting user recipes", err);
  }
};
