import React, { useState } from 'react'
import axios from 'axios'
import LoginPage from '../loginPage/loginPage'
import Sidenav from '../sidenav/sidenav'
import Dashboard from '../dashboard/dashboard'
import LoadingSpinner from '../loadingSpinner/loadingSpinner'
import './app.css'

const GITLAB_API_URL = 'https://harbor.beamzone.net/api/v4'

function App () {
  // State variables using useState
  const [accessToken, setAccessToken] = useState('')
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState({})
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [sidenavOpen, setSidenavOpen] = useState(false)

  // Function to handle login and fetch user profile and issues/projects data
  const handleLogin = (token) => {
    setAccessToken(token)
    fetchUserProfile(token)
    fetchIssuesAndProjects(token)
  }

  // Function to fetch user profile from GitLab API
  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(`${GITLAB_API_URL}/user`, {
        headers: { 'PRIVATE-TOKEN': token }
      })
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  // Function to fetch closed issues and merge requests assigned to the user
  const fetchIssuesAndProjects = async (token) => {
    setLoading(true)
    try {
      let allIssues = []
      let allMergeRequests = []
      let page = 1
      let totalPages = 1

      // Fetch all closed issues assigned to the user
      while (page <= totalPages) {
        const response = await axios.get(`${GITLAB_API_URL}/issues`, {
          headers: { 'PRIVATE-TOKEN': token },
          params: {
            assignee_id: user?.id,
            state: 'closed',
            per_page: 100,
            page,
            order_by: 'created_at',
            sort: 'desc'
          }
        })

        allIssues = [...allIssues, ...response.data]
        totalPages = parseInt(response.headers['x-total-pages'], 10) || 1
        page += 1
      }

      page = 1
      totalPages = 1

      // Fetch all closed merge requests assigned to the user
      while (page <= totalPages) {
        const response = await axios.get(`${GITLAB_API_URL}/merge_requests`, {
          headers: { 'PRIVATE-TOKEN': token },
          params: {
            assignee_id: user?.id,
            state: 'closed',
            per_page: 100,
            page,
            order_by: 'created_at',
            sort: 'desc'
          }
        })

        allMergeRequests = [...allMergeRequests, ...response.data]
        totalPages = parseInt(response.headers['x-total-pages'], 10) || 1
        page += 1
      }

      // Process fetched issues and merge requests into projectsMap
      const projectsMap = {}
      for (const issue of allIssues) {
        const projectId = issue.project_id
        if (!projectsMap[projectId]) {
          const projectResponse = await axios.get(`${GITLAB_API_URL}/projects/${projectId}`, {
            headers: { 'PRIVATE-TOKEN': token }
          })

          const languagesResponse = await axios.get(`${GITLAB_API_URL}/projects/${projectId}/languages`, {
            headers: { 'PRIVATE-TOKEN': token }
          })

          projectsMap[projectId] = {
            title: projectResponse.data.name,
            description: projectResponse.data.description,
            languages: Object.keys(languagesResponse.data),
            issues: [],
            mergeRequests: []
          }
        }
        projectsMap[projectId].issues.push(issue)
      }

      // Associate merge requests with respective projects in projectsMap
      for (const mr of allMergeRequests) {
        const projectId = mr.project_id
        if (projectsMap[projectId]) {
          projectsMap[projectId].mergeRequests.push(mr)
        }
      }

      // Set projectsMap in state and setLoading to false
      setProjects(projectsMap)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching issues and projects:', error)
      setLoading(false)
    }
  }

  // Function to handle user logout
  const handleLogout = () => {
    setAccessToken('')
    setUser(null)
  }

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode)
  }

  // Function to toggle sidenav open/close state
  const toggleSidenav = () => {
    setSidenavOpen(prevState => !prevState)
  }

  // Render different components based on application state
  if (!accessToken) {
    return <LoginPage onLogin={handleLogin} />
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Hamburger menu icon to toggle sidenav visibility */}
      <div className="hamburger-menu" onClick={toggleSidenav}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {/* Sidenav component */}
      <Sidenav user={user} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} isActive={sidenavOpen} />
      {/* Dashboard component */}
      <div className="content">
        <Dashboard projects={projects} />
      </div>
    </div>
  )
}

export default App
