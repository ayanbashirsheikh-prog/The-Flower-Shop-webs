import { createSlice } from "@reduxjs/toolkit";

// =====================================================
// SAFE USER RESTORE
// =====================================================

const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch (error) {
    console.error(
      "Failed to restore saved user:",
      error
    );

    localStorage.removeItem("user");

    return null;
  }
};

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  user: getSavedUser(),

  /*
    JWT token frontend/localStorage mein store nahi hoga.

    Backend HTTP-only cookie mein token store karega.
  */

  isAuthenticated: !!localStorage.getItem("user"),

  loading: false,
};

// =====================================================
// AUTH SLICE
// =====================================================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // =================================================
    // LOGIN SUCCESS
    // =================================================

    loginSuccess: (state, action) => {
      const user = action.payload?.user || null;

      state.user = user;

      state.isAuthenticated = !!user;

      state.loading = false;

      // Sirf user information save karo.
      // JWT token kabhi localStorage mein mat save karo.

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      } else {
        localStorage.removeItem("user");
      }
    },

    // =================================================
    // LOGOUT
    // =================================================

    logout: (state) => {
      state.user = null;

      state.isAuthenticated = false;

      state.loading = false;

      localStorage.removeItem("user");
    },

    // =================================================
    // AUTH LOADING
    // =================================================

    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },

    // =================================================
    // SET USER
    // =================================================

    setUser: (state, action) => {
      const user = action.payload || null;

      state.user = user;

      state.isAuthenticated = !!user;

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      } else {
        localStorage.removeItem("user");
      }
    },
  },
});

// =====================================================
// EXPORT ACTIONS
// =====================================================

export const {
  loginSuccess,
  logout,
  setAuthLoading,
  setUser,
} = authSlice.actions;

// =====================================================
// EXPORT REDUCER
// =====================================================

export default authSlice.reducer;