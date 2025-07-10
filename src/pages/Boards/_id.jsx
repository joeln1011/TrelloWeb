import { useEffect } from 'react';

import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
} from '~/apis';

import { cloneDeep } from 'lodash';
import Container from '@mui/material/Container';
import AppBar from '~/components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner';
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from '~/redux/activeBoard/activeBoardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard';
import { selectCurrentActiveCard } from '~/redux/activeCard/activeCardSlice';
function Board() {
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);
  const activeCard = useSelector(selectCurrentActiveCard);
  const { boardId } = useParams();

  useEffect(() => {
    // Call API to fetch board
    dispatch(fetchBoardDetailsAPI(boardId));
  }, [dispatch, boardId]);

  // Call API and handle drag and drop column
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((col) => col._id);

    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    dispatch(updateCurrentActiveBoard(newBoard));

    // Call API to update the board with new column order
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds,
    });
  };

  const moveCardSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = cloneDeep(board);
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }
    dispatch(updateCurrentActiveBoard(newBoard));

    //Call API to update the column with new card order
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderedCardIds,
    });
  };

  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((col) => col._id);

    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    dispatch(updateCurrentActiveBoard(newBoard));

    // Call API to update the board with new column order
    let prevCardOrderIds =
      dndOrderedColumns.find((col) => col._id === prevColumnId)?.cardOrderIds ||
      [];
    // Hande case when dragging a last card from a column, column will has a placeholder card and delete it before send to BE
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = [];

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(
        (col) => col._id === nextColumnId
      )?.cardOrderIds,
    });
  };

  if (!board) {
    return <PageLoadingSpinner caption="Loading Board..." />;
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {activeCard && <ActiveCard />}
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        moveCardSameColumn={moveCardSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  );
}

export default Board;
