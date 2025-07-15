import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false,
};

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true;
    },

    //clean and hide modal active card
    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null;
      state.isShowModalActiveCard = false;
    },
    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload;
      state.currentActiveCard = fullCard;
    },
  },
  extraReducers: () => {},
});
export const {
  clearAndHideCurrentActiveCard,
  updateCurrentActiveCard,
  showModalActiveCard,
} = activeCardSlice.actions;

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard;
};

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard;
};

export const activeCardReducer = activeCardSlice.reducer;
