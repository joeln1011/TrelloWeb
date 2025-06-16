import { useEffect, useState } from "react";
//import { mockData } from "~/apis/mock-data";
//import { useParams } from "react-router-dom";
import { fetchBoardDetailsAPI } from "~/apis";
import Container from "@mui/material/Container";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";

function Board() {
  const [board, setBoard] = useState(null);
  //const { boardIdd } = useParams();
  useEffect(() => {
    const boardId = "685098f32dc8f900ebf44c18";
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board);
    });
  }, []);

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  );
}

export default Board;
