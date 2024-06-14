import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import './loginPage.css'

// Define the LoginPage component which takes onLogin, gitlabUrl, and projectName as props
const LoginPage = ({ onLogin }) => {
  // State to store the access token entered by the user
  const [accessToken, setAccessToken] = useState('')
  // State to store any error messages
  const [error, setError] = useState('')
  // State to manage the selected GitLab API URL
  const [gitlabUrl, setGitlabUrl] = useState('https://harbor.beamzone.net/api/v4')
  // State to manage the project name

  // Function to handle the login process
  const handleLogin = async () => {
    try {
      // Test the token by making a request to the GitLab API
      const response = await axios.get(`${gitlabUrl}/user`, {
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

  // Function to handle changing the GitLab API URL
  const handleGitlabUrlChange = (event) => {
    const newUrl = event.target.value
    setGitlabUrl(newUrl)
  }

  // Render the login page
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>GitLab Statistics</h1>
        {/* Dropdown menu for selecting predefined GitLab API URLs */}
        <div>
          <label htmlFor="gitlabUrl" className="login-selection-info-label">Select GitLab Instance:</label>
          <select id="gitlabUrl" value={gitlabUrl} onChange={handleGitlabUrlChange}>
            <option value="https://harbor.beamzone.net/api/v4">Harbor</option>
            <option value="https://gitlab.example.com/api/v4">Example GitLab</option>
          </select>
        </div>
        {/* Input field for manually entering GitLab API URL */}
        <div>
          <input
            type="text"
            id="customGitlabUrl"
            value={gitlabUrl}
            onChange={handleGitlabUrlChange}
            placeholder="Enter custom GitLab URL"
          />
        </div>
        {/* Input for entering access token */}
        <input
          type="password"
          placeholder="Enter GitLab Access Token"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
        />
        {/* Display error message if there is an error */}
        {error && <p className="error-message">{error}</p>}
        {/* Button to trigger login process */}
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  )
}

// Define prop types for validation to ensure the correct data types are passed to the component
LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired
}

export default LoginPage
