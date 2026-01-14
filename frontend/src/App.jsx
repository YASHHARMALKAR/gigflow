import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateGigPage from './pages/CreateGigPage';
import GigDetailsPage from './pages/GigDetailsPage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';
import io from 'socket.io-client';

const socket = io('/', {
    autoConnect: false
});

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
      if (user) {
          socket.connect();
          socket.emit('join_room', user._id);

          socket.on('notification', (data) => {
              toast.success(data.message);
          });
      }

      return () => {
          socket.off('notification');
          socket.disconnect();
      }
  }, [user]);

  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
              <Route path="/create-gig" element={user ? <CreateGigPage /> : <Navigate to="/login" />} />
              <Route path="/gigs/:id" element={<GigDetailsPage />} />
            </Routes>
          </div>
        </div>
      </Router>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
