import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../firebase/auth';
import './Navbar.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      navigate('/login');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    // Placeholder for future global search
    setSearchValue('');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">U</span>
          <div>
            <span className="brand-label">Campus Connect</span>
            <span className="brand-subtext">College hub</span>
          </div>
        </Link>

        {user && (
          <>
            <form className="navbar-search" onSubmit={handleSearchSubmit}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search posts, students, events..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>

            <div className="navbar-menu">
              <Link to="/" className="nav-link">Feed</Link>
              <Link to="/events" className="nav-link">Events</Link>
              <Link to={`/profile/${user.uid}`} className="nav-link">Profile</Link>
              <button onClick={handleLogout} className="nav-button">Logout</button>
              <div className="nav-user">
                <div className="user-avatar">
                  {user.displayName?.[0]?.toUpperCase() || 'U'}
                  <span className="status-dot" />
                </div>
                <div>
                  <p className="user-name">{user.displayName || 'Student'}</p>
                  <p className="user-status">Online</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

