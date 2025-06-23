import { useEffect, useState } from "react";
//import { mockData } from "~/apis/mock-data";
//import { useParams } from "react-router-dom";
import { mapOrder } from "~/utils/sorts";

import {
  fetchBoardDetailsAPI,
  createNewCardAPI,
  createNewColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
} from "~/apis";

import { generatePlaceholderCard } from "~/utils/formatters";
import { isEmpty } from "lodash";
import Container from "@mui/material/Container";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

function Board() {
  const [board, setBoard] = useState(null);
  //const { boardIdd } = useParams();
  useEffect(() => {
    const boardId = "6855bd3e6ce5899e61d47828";
    fetchBoardDetailsAPI(boardId).then((board) => {
      // Sort columns here before setting the board state
      board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");

      board.columns.forEach((column) => {
        // Handle case where a column has no cards
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          // Sort cards here before setting the board state
          column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
        }
      });
      setBoard(board);
    });
  }, []);

  // Create a new column in the board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });
    // Add a placeholder card to the newly created column
    createdColumn.cards = [generatePlaceholderCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];

    //update the board state with the new column
    const newBoard = { ...board };
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);
    setBoard(newBoard);
  };

  // Create a new card in the board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === newCardData.columnId
    );
    if (columnToUpdate) {
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard];
        columnToUpdate.cardOrderIds = [createdCard._id];
      } else {
        columnToUpdate.cards.push(createdCard);
        columnToUpdate.cardOrderIds.push(createdCard._id);
      }
    }

    setBoard(newBoard);
  };

  // Call API and handle drag and drop column
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((col) => col._id);

    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);

    // Call API to update the board with new column order

    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds,
    });
  };

  const moveCardSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    columnToUpdate.cards = dndOrderedCards;
    columnToUpdate.cardOrderIds = dndOrderedCardIds;

    setBoard(newBoard);

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
    setBoard(newBoard);

    // Call API to update the board with new column order
    let prevCardOrderIds =
      dndOrderedColumns.find((col) => col._id === prevColumnId)?.cardOrderIds ||
      [];
    // Hande case when dragging a last card from a column, column will has a placeholder card and delete it before send to BE
    if (prevCardOrderIds[0].includes("placeholder-card")) prevCardOrderIds = [];

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
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          width: "100vw",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6">Loading Board...</Typography>
      </Box>
    );
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardSameColumn={moveCardSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  );
}

export default Board;
