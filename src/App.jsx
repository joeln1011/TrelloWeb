import { Routes, Route, Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/redux/user/userSlice';
import Board from '~/pages/Boards/_id';
import NotFound from '~/pages/404/NotFound';
import Auth from '~/pages/Auth/Auth';
import AccountVerification from '~/pages/Auth/AccountVerification';
import Settings from '~/pages/Settings/Settings';
import Boards from '~/pages/Boards';

// ProtectedRoute component to check if the user is authenticated
const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }
  return <Outlet />;
};
function App() {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <Routes>
      {/* Redirect Route */}
      <Route path="/" element={<Navigate to="/boards" replace={true} />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* Board Detail */}
        <Route path="/boards/:boardId" element={<Board />} />
        <Route path="/boards" element={<Boards />} />

        {/* User Settings */}
        <Route path="/settings/account" element={<Settings />} />
        <Route path="/settings/security" element={<Settings />} />
        <Route path="/settings/cart" element={<Settings />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />

      {/* 404 not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
