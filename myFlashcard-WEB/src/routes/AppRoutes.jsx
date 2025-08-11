import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import UserDashboard from "../pages/user/UserDashboard";
import ProfileHome from "../pages/user/ProfileHome";
import ProfileEdit from "../pages/user/ProfileEdit";
import ProfileDecks from "../pages/user/ProfileDecks";
import UserDeckDetail from "../pages/user/UserDeckDetail";
import FlashcardList from "../pages/flashcard/FlashcardList";
import CreateDeck from "../pages/deck/CreateDeck";
import DeckList from "../pages/deck/DeckList";
import DeckDetail from "../pages/deck/DeckDetail";
import StudyDeckPage from "../pages/deck/StudyDeckPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import useAuthStore from "../store/auth-store";

const AdminRoute = ({ children }) => {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />
        <Route path="/decks" element={<DeckList />} />
        <Route path="/decks/:deckId" element={<DeckDetail />} />
        <Route path="/decks/:deckId/study" element={<StudyDeckPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileHome />} />
          <Route path="edit" element={<ProfileEdit />} />
          <Route path="decks" element={<ProfileDecks />} />
          <Route path="decks/:deckId" element={<UserDeckDetail />} />
          <Route path="flashcards" element={<FlashcardList />} />
          <Route path="create" element={<CreateDeck />} />
        </Route>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};
export default AppRoutes;
