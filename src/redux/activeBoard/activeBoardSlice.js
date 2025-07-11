import authorizeAxiosInstance from '~/utils/authorizeAxios';
import { mapOrder } from '~/utils/sorts';
import { generatePlaceholderCard } from '~/utils/formatters';
import { isEmpty } from 'lodash';
import { API_ROOT } from '~/utils/constants';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  currentActiveBoard: null,
};

export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailAPI',
  async (boardId) => {
    const response = await authorizeAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}`
    );
    return response.data;
  }
);

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,

  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      const board = action.payload;

      //Update the current active board
      state.currentActiveBoard = board;
    },
    updateCardInBoard: (state, action) => {
      // Update nested data
      const incomingCard = action.payload;
      const column = state.currentActiveBoard.columns.find(
        (i) => i._id === incomingCard.columnId
      );
      if (column) {
        const card = column.cards.find((i) => i._id === incomingCard._id);
        if (card) {
          Object.keys(incomingCard).forEach((key) => {
            card[key] = incomingCard[key];
          });
        }
      }
    },
  },

  //
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload is response.data reuturned from the API
      let board = action.payload;

      //Combine members of owners and members
      board.FE_allUsers = board.owners.concat(board.members);

      // Sort columns here before setting the board state
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id');

      board.columns.forEach((column) => {
        // Handle case where a column has no cards
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          // Sort cards here before setting the board state
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id');
        }
      });

      state.currentActiveBoard = board;
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard, updateCardInBoard } =
  activeBoardSlice.actions;

// Selectors
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard;
};
//export default activeBoardSlice.reducer;
export const activeBoardReducer = activeBoardSlice.reducer;
