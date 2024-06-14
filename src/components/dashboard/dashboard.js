import React from 'react'
import PropTypes from 'prop-types' // Import PropTypes for prop types validation
import Charts from '../charts/charts'
import ProjectCard from '../projectCard/projectCard'

// Define the Dashboard component which takes projects as a prop
const Dashboard = ({ projects }) => (
  <div className="main-content container">
    <h1 style={{ width: '100%' }}>GitLab Statistics</h1>
    <h2>Projects and Languages</h2>
    <Charts projects={projects} />
    <h2 style={{ width: '100%' }}>Projects List</h2>
    {Object.keys(projects).map((projectId) => (
      <ProjectCard key={projectId} project={projects[projectId]} />
    ))}
  </div>
)

// Define prop types for validation to ensure the correct data shape is passed to the component
Dashboard.propTypes = {
  projects: PropTypes.objectOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    issues: PropTypes.array.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired
  })).isRequired
}

export default Dashboard
