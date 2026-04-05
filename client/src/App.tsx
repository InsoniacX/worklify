import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Dashboard,
  UserPage,
  UserInput,
  UserEdit,
  AuthPage,
  ProductPage,
  ProductInput,
  ProductEdit,
  ProfilePage,
  SettingPage,
  Homepage,
  TaskPage,
  TeamPage,
  NotificationPage,
} from "@/pages";
import { AdminRoute, ProtectedRoute } from "@/components";
import SchedulePage from "./pages/App/SchedulePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />

        {/* Admin Dashboard */}
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
          path="/admin/dashboard/users"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/users/new"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserInput />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/users/:id/edit"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserEdit />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/products"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ProductPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/products/new"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ProductInput />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/products/:id/edit"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ProductEdit />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/profile"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ProfilePage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/settings"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <SettingPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* App */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/tasks"
          element={
            <ProtectedRoute>
              <TaskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/teams"
          element={
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/schedule"
          element={
            <ProtectedRoute>
              <SchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/notifications"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
