import { Routes, Route, Navigate } from "react-router";
import Board from "~/pages/Boards/_id";
import NotFound from "~/pages/404/NotFound";
import Auth from "~/pages/Auth/Auth";
function App() {
  return (
    <Routes>
      {/* Redirect Route */}
      <Route
        path="/"
        element={
          <Navigate to="/boards/6855bd3e6ce5899e61d47828" replace={true} />
        }
      />
      {/* Board Detail */}
      <Route path="/boards/:boardId" element={<Board />} />

      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />

      {/* 404 not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
