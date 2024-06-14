import React from 'react'
import './sidenav.css'

const Sidenav = ({ user, onLogout, darkMode, toggleDarkMode, isActive }) => {
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

export default Sidenav
