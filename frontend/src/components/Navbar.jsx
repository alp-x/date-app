import { Link, useNavigate } from 'react-router-dom';
import { Home, Person, Message, Star, Settings, Logout } from '@mui/icons-material';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">DateApp</Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="nav-link">
              <Home className="text-gray-600 hover:text-primary" />
            </Link>
            <Link to="/profile" className="nav-link">
              <Person className="text-gray-600 hover:text-primary" />
            </Link>
            <Link to="/messages" className="nav-link">
              <Message className="text-gray-600 hover:text-primary" />
            </Link>
            <Link to="/premium" className="nav-link">
              <Star className="text-gray-600 hover:text-primary" />
            </Link>
            <Link to="/settings" className="nav-link">
              <Settings className="text-gray-600 hover:text-primary" />
            </Link>
            <button 
              onClick={handleLogout}
              className="nav-link"
              title="Oturumu Kapat"
            >
              <Logout className="text-gray-600 hover:text-primary" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 