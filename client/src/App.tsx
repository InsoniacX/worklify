import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Dashboard,
  UserPage,
  UserInput,
  UserEdit,
  LoginPage,
  ProductPage,
} from "@/pages";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/users"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/users/new"
          element={
            <ProtectedRoute>
              <UserInput />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/users/:id/edit"
          element={
            <ProtectedRoute>
              <UserEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/products/"
          element={
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
