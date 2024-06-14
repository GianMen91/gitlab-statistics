import React, { } from 'react'
import PropTypes from 'prop-types' // Import PropTypes for prop types validation

import 'chartjs-adapter-date-fns'
import { Pie } from 'react-chartjs-2'

// eslint-disable-next-line no-unused-vars
import { Chart } from 'chart.js/auto'

import 'react-calendar-heatmap/dist/styles.css'
import './charts.css'

// Define the Charts component which takes projects as a prop
const Charts = ({ projects }) => {
  // Function to prepare data for the project issues pie chart
  const prepareProjectPieData = (projects) => {
    // Extract project titles as labels
    const labels = Object.keys(projects).map((projectId) => projects[projectId].title)
    // Extract the number of issues for each project
    const data = Object.keys(projects).map((projectId) => projects[projectId].issues.length)

    // Return the data in a format suitable for the Pie chart
    return {
      labels,
      datasets: [
        {
          label: 'Number of Issues I worked on',
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ]
        }
      ]
    }
  }

  // Function to prepare data for the language usage pie chart
  const prepareLanguagePieData = (projects) => {
    // Initialize an object to count occurrences of each language
    const languageCounts = {}
    // Iterate over projects to count the languages used
    Object.keys(projects).forEach((projectId) => {
      projects[projectId].languages.forEach((lang) => {
        if (languageCounts[lang]) {
          languageCounts[lang]++
        } else {
          languageCounts[lang] = 1
        }
      })
    })

    // Extract labels (languages) and data (counts) for the Pie chart
    const labels = Object.keys(languageCounts)
    const data = Object.values(languageCounts)

    // Return the data in a format suitable for the Pie chart
    return {
      labels,
      datasets: [
        {
          label: 'Number of projects using this language',
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ]
        }
      ]
    }
  }

  // Render the Pie charts for project issues and language usage
  return (
    <div className="chart-card">
      <div className="chart-row">
        <div className="chart-container">
          <h2>Issues per Project</h2>
          <div className="pie-chart-container">
            <Pie data={prepareProjectPieData(projects)} />
          </div>
        </div>
        <div className="chart-container">
          <h2>Language Usage</h2>
          <div className="pie-chart-container">
            <Pie data={prepareLanguagePieData(projects)} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Define prop types for validation to ensure the correct data shape is passed to the component
Charts.propTypes = {
  projects: PropTypes.objectOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    issues: PropTypes.array.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired
  })).isRequired
}

export default Charts
