import React from 'react'

import 'chartjs-adapter-date-fns'
import { Pie } from 'react-chartjs-2'

import 'react-calendar-heatmap/dist/styles.css'

const Charts = ({ projects }) => {
  const prepareProjectPieData = (projects) => {
    const labels = Object.keys(projects).map((projectId) => projects[projectId].title)
    const data = Object.keys(projects).map((projectId) => projects[projectId].issues.length)

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
          ],
        }
      ],
    }
  };

  const prepareLanguagePieData = (projects) => {
    let languageCounts = {}
    Object.keys(projects).forEach((projectId) => {
      projects[projectId].languages.forEach((lang) => {
        if (languageCounts[lang]) {
          languageCounts[lang]++
        } else {
          languageCounts[lang] = 1
        }
      })
    })

    const labels = Object.keys(languageCounts)
    const data = Object.values(languageCounts)

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

export default Charts
