import { Routes, Route, Navigate } from "react-router";
import Board from "~/pages/Boards/_id";
import NotFound from "~/pages/404/NotFound";
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to="/boards/6855bd3e6ce5899e61d47828" replace={true} />
        }
      />
      <Route path="/boards/:boardId" element={<Board />} />

      {/* 404 not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
