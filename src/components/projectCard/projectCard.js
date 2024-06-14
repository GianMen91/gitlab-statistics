import React from 'react'
import PropTypes from 'prop-types' // Import PropTypes for prop types validation
import languageIcons from '../languageIcons/languageIcons'
import './projectCard.css'

// Define the ProjectCard component which takes a project as a prop
const ProjectCard = ({ project }) => {
  // Function to clean up merge request titles
  const cleanMergeRequestTitle = (title) => {
    let cleanedTitle = title.replace('Draft: Resolve ', '')
    cleanedTitle = cleanedTitle.replace('WIP: Resolve ', '')
    return cleanedTitle
  }

  // Render the project card
  return (
    <div className="card">
      <h2>{project.title}</h2>
      <h3>Project Description:</h3>
      <p>{project.description || 'not available'}</p>
      <h3>Issues I worked on:</h3>
      <p>Total: {project.issues.length}</p>
      <h3>Project Languages:</h3>
      <p>
        {project.languages.map((lang) => (
          <img
            key={lang}
            src={languageIcons[lang] || '/assets/languages/default.png'}
            alt={lang}
            title={lang}
            className="language-icon"
          />
        ))}
      </p>
      {project.issues.length > 0 && (
        <div>
          <h3>Last issues I worked on:</h3>
          <ul>
            {project.issues.slice(0, 4).map((issue) => (
              <li key={issue.id}>{issue.title}</li>
            ))}
          </ul>
        </div>
      )}
      {project.mergeRequests.length > 0 && (
        <div>
          <h3>Partial Merge Requests History</h3>
          <ul>
            {project.mergeRequests.map((mr) => (
              <li key={mr.id}>
                <strong>{cleanMergeRequestTitle(mr.title)}</strong> - {mr.state} -{' '}
                {new Date(mr.created_at).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Define prop types for validation to ensure the correct data shape is passed to the component
ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    issues: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired
    })).isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    mergeRequests: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired
    })).isRequired
  }).isRequired
}

export default ProjectCard
