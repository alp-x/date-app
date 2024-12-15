import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {isAuthenticated && <Navbar />}
      <main className={`flex-1 ${isAuthenticated ? "container mx-auto px-4 py-6" : ""}`}>
        <Outlet />
      </main>
      {isAuthenticated && <Footer />}
    </div>
  );
}

export default Layout; 