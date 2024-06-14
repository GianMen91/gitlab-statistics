import React from 'react'
import PropTypes from 'prop-types' // Import PropTypes for prop types validation
import './sidenav.css'

// Define the Sidenav component which takes user, onLogout, darkMode, toggleDarkMode, and isActive as props
const Sidenav = ({ user, onLogout, darkMode, toggleDarkMode, isActive }) => {
  // Render the side navigation bar
  return (
    <div className={`sidenav ${isActive ? 'active' : ''}`}>
      <div className="profile-section">
        <img src={user.avatar_url} alt="User Profile" className="profile-image" />
        <h2 className="profile-name">{user.name}</h2>
        <div className="dark-mode-toggle">
          <span className="toggle-label">Dark Mode:</span>
          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      <div className="logout-section">
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>
    </div>
  )
}

// Define prop types for validation to ensure the correct data shape is passed to the component
Sidenav.propTypes = {
  user: PropTypes.shape({
    avatar_url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired
}

export default Sidenav
