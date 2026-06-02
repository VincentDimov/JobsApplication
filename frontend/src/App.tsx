import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { RequireAuth } from "./auth/RequireAuth";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { AdminCustomersPage } from "./pages/AdminCustomersPage";
import { JobsPage } from "./pages/JobsPage";
import { KanbanPage } from "./pages/KanbanPage";

export const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin/customers"
          element={
            <RequireAuth>
              <Layout>
                <AdminCustomersPage />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/jobs"
          element={
            <RequireAuth>
              <Layout>
                <JobsPage />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/jobs/:jobId/kanban"
          element={
            <RequireAuth>
              <Layout>
                <KanbanPage />
              </Layout>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
