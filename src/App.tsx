import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

// Layout
import { Layout } from "@/components/Layout";

// Public Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

// Participant Pages
import Dashboard from "@/pages/Dashboard";
import HackathonList from "@/pages/HackathonList";
import HackathonDetail from "@/pages/HackathonDetail";
import TeamManagement from "@/pages/TeamManagement";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminHackathonList from "@/pages/admin/HackathonList";
import ManageHackathon from "@/pages/admin/ManageHackathon";
import TeamSubmissions from "@/pages/admin/TeamSubmissions";

// Profile Page
import Profile from "@/pages/Profile";
import { LoaderIcon } from "lucide-react";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <LoaderIcon className="animate-spin top-[50%] left-[50%] absolute" />
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Route that redirects authenticated users away from auth pages
const AuthRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <LoaderIcon className="animate-spin top-[50%] left-[50%] absolute" />
    </div>;
  }

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
      
      {/* Participant Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/hackathons" element={
        <ProtectedRoute>
          <Layout>
            <HackathonList />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/hackathons/:id" element={
        <ProtectedRoute>
          <Layout>
            <HackathonDetail />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/team" element={
        <ProtectedRoute>
          <Layout>
            <TeamManagement />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/hackathons" element={
        <ProtectedRoute requireAdmin={true}>
          <Layout>
            <AdminHackathonList />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/hackathons/new" element={
        <ProtectedRoute requireAdmin={true}>
          <Layout>
            <ManageHackathon />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/hackathons/:id" element={
        <ProtectedRoute requireAdmin={true}>
          <Layout>
            <ManageHackathon />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/hackathons/:id/submissions" element={
        <ProtectedRoute requireAdmin={true}>
          <Layout>
            <TeamSubmissions />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Profile Route */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Root Redirect */}
      <Route path="" element={<Navigate to={user?.role === "admin" ? "/admin" : "/"} />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;