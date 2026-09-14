import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Home, Bookmark, KeyRound, Building2, BarChart2, LogOut } from 'lucide-react';

import Login from './pages/Login';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import Favourites from './pages/Favourites';
import Rentals from './pages/Rentals';
import Projects from './pages/Projects';
import Insights from './pages/Insights';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const links = [
    { to: '/', label: 'Listings', icon: Home },
    { to: '/rentals', label: 'Rentals', icon: KeyRound },
    { to: '/projects', label: 'Projects', icon: Building2 },
    { to: '/favourites', label: 'Saved', icon: Bookmark },
    { to: '/insights', label: 'Insights', icon: BarChart2 },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-emerald-600 flex items-center gap-2">
            <span className="bg-emerald-600 text-white rounded p-1">IVY</span>
            <span>HOMES</span>
          </Link>
          <nav className="hidden md:flex gap-1">
            {links.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                    active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono">{user.email}</span>
          <button
            onClick={logout}
            className="text-slate-500 hover:text-rose-600 p-2 rounded-md hover:bg-rose-50 transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navigation />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute><Listings /></PrivateRoute>} />
              <Route path="/listings/:id" element={<PrivateRoute><ListingDetail /></PrivateRoute>} />
              <Route path="/favourites" element={<PrivateRoute><Favourites /></PrivateRoute>} />
              <Route path="/rentals" element={<PrivateRoute><Rentals /></PrivateRoute>} />
              <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
              <Route path="/insights" element={<PrivateRoute><Insights /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}