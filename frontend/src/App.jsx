import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

// Temporary Home Component for testing protected routes
const Home = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome!</h1>
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-semibold mb-2">{user?.name}</h2>
        <p className="text-gray-500 mb-6">@{user?.username}</p>
        <p className="text-gray-500 mb-6">{user?.email}</p>
        <button 
          onClick={logout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
