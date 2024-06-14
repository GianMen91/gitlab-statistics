import React, { useState } from 'react'
import axios from 'axios'

const GITLAB_API_URL = 'https://harbor.beamzone.net/api/v4';

const LoginPage = ({ onLogin }) => {
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // Test the token by making a request to GitLab API
      const response = await axios.get(`${GITLAB_API_URL}/user`, {
        headers: { 'PRIVATE-TOKEN': accessToken },
      });

      if (response.status === 200) {
        onLogin(accessToken);
      }
    } catch (err) {
      setError('Invalid access token. Please try again.');
    }
  }

  return (
        <div className="login-page">
            <div className="login-card">
                <h1>GitLab Statistics</h1>
                <input
                    type="text"
                    placeholder="Enter GitLab Access Token"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                />
                {error && <p className="error-message">{error}</p>}
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
  )
}

export default LoginPage
