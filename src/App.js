import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { store } from './store/store';
import './i18n';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Profile from './pages/Profile';
import FilePage from './pages/FilePage';

// Auth Components
import PrivateRoute from './components/auth/PrivateRoute';
import RegisterForm from './components/auth/RegisterForm';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterForm />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <PrivateRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </PrivateRoute>
              } />
              <Route path="/projects" element={
                <PrivateRoute>
                  <MainLayout>
                    <Projects />
                  </MainLayout>
                </PrivateRoute>
              } />
              <Route path="/projects/:id" element={
                <PrivateRoute>
                  <MainLayout>
                    <ProjectDetails />
                  </MainLayout>
                </PrivateRoute>
              } />
              <Route path="/files" element={
                <PrivateRoute>
                  <MainLayout>
                    <FilePage />
                  </MainLayout>
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </PrivateRoute>
              } />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
