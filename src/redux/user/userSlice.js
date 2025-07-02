import authorizeAxiosInstance from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
const initialState = {
  currentUser: null,
};

export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data
    );
    return response.data;
  }
);

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizeAxiosInstance.delete(
      `${API_ROOT}/v1/users/logout`
    );
    if (showSuccessMessage) {
      // Display a success message after logout
      toast.success('Successfully logged out!');
    }
    return response.data;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload is response.data reuturned from the API
      const user = action.payload;
      state.currentUser = user;
    });
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      // Clear the current user to null when logging out and back to login page
      state.currentUser = null;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {} = userSlice.actions;

export const selectCurrentUser = (state) => {
  return state.user.currentUser;
};
export const userReducer = userSlice.reducer;
