import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useNavigate } from 'react-router';
import './Navbar.scss';

const Navbar = () => {
  const { user, auth0User, handleLogout, isAuthenticated, loginWithRedirect } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onLogout = async () => {
    await handleLogout();
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithRedirect({
        appState: {
          returnTo: '/dashboard',
        },
      });
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <h2>PrepAI</h2>
      </div>

      <div className="navbar-menu">
        {isAuthenticated && auth0User ? (
          <div className="user-profile-container" ref={dropdownRef}>
            <div 
              className={`user-profile ${isDropdownOpen ? 'active' : ''}`} 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="avatar">
                {auth0User?.picture ? (
                  <img src={auth0User.picture} alt={auth0User.name} />
                ) : (
                  (auth0User?.name || auth0User?.nickname || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <span className="username">{auth0User?.name || auth0User?.nickname}</span>
              <svg className={`chevron-icon ${isDropdownOpen ? 'rotate' : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>

            {isDropdownOpen && (
              <div className="profile-dropdown">
                <button className="dropdown-item" onClick={handleDashboardClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  Dashboard
                </button>
                <hr />
                <button className="dropdown-item logout-item" onClick={onLogout}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          !isAuthenticated && (
            <button className="button primary-button" onClick={handleGoogleLogin}>
              Get Started for Free
            </button>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
