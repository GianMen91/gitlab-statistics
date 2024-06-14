import React, { useState } from 'react'
import PropTypes from 'prop-types' // Import PropTypes for prop types validation
import axios from 'axios'
import './loginPage.css'

const GITLAB_API_URL = 'https://harbor.beamzone.net/api/v4'

// Define the LoginPage component which takes onLogin as a prop
const LoginPage = ({ onLogin }) => {
  // State to store the access token entered by the user
  const [accessToken, setAccessToken] = useState('')
  // State to store any error messages
  const [error, setError] = useState('')

  // Function to handle the login process
  const handleLogin = async () => {
    try {
      // Test the token by making a request to the GitLab API
      const response = await axios.get(`${GITLAB_API_URL}/user`, {
        headers: { 'PRIVATE-TOKEN': accessToken }
      })

      if (response.status === 200) {
        // If the response is successful, call the onLogin prop with the access token
        onLogin(accessToken)
      }
    } catch (err) {
      // If there is an error, set an error message
      setError('Invalid access token. Please try again.')
    }
  }

  // Render the login page
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

// Define prop types for validation to ensure the correct data type is passed to the component
LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired
}

export default LoginPage
