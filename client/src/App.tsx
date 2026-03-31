import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Dashboard,
  UserPage,
  UserInput,
  UserEdit,
  LoginPage,
  ProductPage,
  ProductInput,
  ProductEdit,
  ProfilePage,
  SettingPage,
} from "@/pages";
import { AdminRoute, ProtectedRoute } from "@/components";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/new"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserInput />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id/edit"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserEdit />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ProductPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ProductInput />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ProductEdit />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ProfilePage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <SettingPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
