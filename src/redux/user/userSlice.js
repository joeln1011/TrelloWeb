import authorizeAxiosInstance from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
  },
});

// Action creators are generated for each case reducer function
// export const {} = userSlice.actions;

export const selectCurrentUser = (state) => {
  return state.user.currentUser;
};
export const userReducer = userSlice.reducer;
