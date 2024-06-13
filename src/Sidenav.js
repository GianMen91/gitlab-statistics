import React from 'react';
import './Sidenav.css';

const Sidenav = ({ user, onLogout }) => {
    return (
        <div className="sidenav">
            <div className="profile-section">
                <img src={user.avatar_url} alt="User Profile" className="profile-image" />
                <h2 className="profile-name">{user.name}</h2>
            </div>
            <div className="logout-section">
                <button onClick={onLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
};

export default Sidenav;
