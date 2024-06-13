import React, { useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import LoginPage from './LoginPage';

import 'chartjs-adapter-date-fns';
import { Bar, Pie } from 'react-chartjs-2';

import { Chart as ChartJS } from 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './App.css';

import javascriptIcon from './assets/languages/javascript.png';
import pythonIcon from './assets/languages/python.png';
import javaIcon from './assets/languages/java.png';
import phpIcon from './assets/languages/php.png';
import htmlIcon from './assets/languages/html.png';
import cssIcon from './assets/languages/css.png';
import flutterIcon from './assets/languages/flutter.png';
import swiftIcon from './assets/languages/swift.png';
import androidIcon from './assets/languages/android.png';
import dartIcon from './assets/languages/dart.png';
import extjsIcon from './assets/languages/extjs.png';
import objectiveCIcon from './assets/languages/objective-c.png';
import rubyIcon from './assets/languages/ruby.png';
import shellIcon from './assets/languages/shell.png';
import cIcon from './assets/languages/c.png';
import cPlusPlusIcon from './assets/languages/c++.png';
import liquidIcon from './assets/languages/liquid.png';
import solidityIcon from './assets/languages/solidity.png';

const GITLAB_API_URL = 'https://harbor.beamzone.net/api/v4';

const languageIcons = {
    Swift: swiftIcon,
    HTML: htmlIcon,
    CSS: cssIcon,
    Android: androidIcon,
    Dart: dartIcon,
    Extjs: extjsIcon,
    Flutter: flutterIcon,
    Java: javaIcon,
    JavaScript: javascriptIcon,
    'Objective-C': objectiveCIcon,
    Python: pythonIcon,
    Ruby: rubyIcon,
    Shell: shellIcon,
    PHP: phpIcon,
    C: cIcon,
    'C++': cPlusPlusIcon,
    Liquid: liquidIcon,
    Solidity: solidityIcon,
};

function App() {
    const [accessToken, setAccessToken] = useState('');
    const [projects, setProjects] = useState({});
    const [loading, setLoading] = useState(true);
    const [issueTimelineData, setIssueTimelineData] = useState(null);
    const [contributionData, setContributionData] = useState([]);
    const [mergeRequests, setMergeRequests] = useState([]);
    const [assigneeId, setAssigneeId] = useState(null);

    const handleLogin = (token) => {
        setAccessToken(token);
        fetchAssigneeId(token);
        fetchIssuesAndProjects(token);
    };

    const fetchAssigneeId = async (token) => {
        try {
          const response = await axios.get(`${GITLAB_API_URL}/user`, {
            headers: {
              'PRIVATE-TOKEN': token,
            },
          });
          setAssigneeId(response.data.id);
        } catch (error) {
          console.error('Error fetching assignee ID:', error);
        }
      };

    const fetchIssuesAndProjects = async (token) => {
        setLoading(true); // Ensure loading is set to true while fetching data
        try {
            let allIssues = [];
            let allMergeRequests = [];
            let page = 1;
            let totalPages = 1;

            while (page <= totalPages) {
                const response = await axios.get(`${GITLAB_API_URL}/issues`, {
                    headers: { 'PRIVATE-TOKEN': token },
                    params: {
                        assignee_id: assigneeId,
                        state: 'closed',
                        per_page: 100,
                        page,
                        order_by: 'created_at',
                        sort: 'desc',
                    },
                });

                allIssues = [...allIssues, ...response.data];
                totalPages = parseInt(response.headers['x-total-pages'], 10) || 1;
                page += 1;
            }

            page = 1;
            totalPages = 1;
            while (page <= totalPages) {
                const response = await axios.get(`${GITLAB_API_URL}/merge_requests`, {
                    headers: { 'PRIVATE-TOKEN': token },
                    params: {
                        assignee_id: assigneeId,
                        state: 'closed',
                        per_page: 100,
                        page,
                        order_by: 'created_at',
                        sort: 'desc',
                    },
                });

                allMergeRequests = [...allMergeRequests, ...response.data];
                totalPages = parseInt(response.headers['x-total-pages'], 10) || 1;
                page += 1;
            }

            const projectsMap = {};
            for (const issue of allIssues) {
                const projectId = issue.project_id;
                if (!projectsMap[projectId]) {
                    const projectResponse = await axios.get(`${GITLAB_API_URL}/projects/${projectId}`, {
                        headers: { 'PRIVATE-TOKEN': token },
                    });

                    const languagesResponse = await axios.get(`${GITLAB_API_URL}/projects/${projectId}/languages`, {
                        headers: { 'PRIVATE-TOKEN': token },
                    });

                    projectsMap[projectId] = {
                        title: projectResponse.data.name,
                        description: projectResponse.data.description,
                        languages: Object.keys(languagesResponse.data),
                        issues: [],
                        mergeRequests: [],
                    };
                }
                projectsMap[projectId].issues.push(issue);
            }

            for (const mr of allMergeRequests) {
                const projectId = mr.project_id;
                if (projectsMap[projectId]) {
                    projectsMap[projectId].mergeRequests.push(mr);
                }
            }

            setProjects(projectsMap);
            setLoading(false);

            const timelineData = prepareIssueTimelineData(allIssues);
            setIssueTimelineData(timelineData);

            const contributionData = prepareContributionData(allIssues);
            setContributionData(contributionData);
            setMergeRequests(allMergeRequests);
        } catch (error) {
            console.error('Error fetching issues and projects:', error);
            setLoading(false);
        }
    };

    const prepareIssueTimelineData = (issues) => {
        const issuesByMonth = issues.reduce((acc, issue) => {
            const createdAt = new Date(issue.created_at);
            const month = createdAt.toLocaleString('default', { year: 'numeric', month: 'short' });
            if (!acc[month]) acc[month] = 0;
            acc[month] += 1;
            return acc;
        }, {});

        const labels = Object.keys(issuesByMonth);
        const data = Object.values(issuesByMonth);

        return {
            labels,
            datasets: [
                {
                    label: 'Issues Assigned',
                    data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
            ],
        };
    };

    const prepareContributionData = (issues) => {
        const contributions = issues.reduce((acc, issue) => {
            const closedAt = new Date(issue.closed_at);
            const date = closedAt.toISOString().split('T')[0];
            if (!acc[date]) acc[date] = 0;
            acc[date] += 1;
            return acc;
        }, {});

        return Object.keys(contributions).map((date) => ({
            date,
            count: contributions[date],
        }));
    };

    const prepareProjectPieData = (projects) => {
        const labels = Object.keys(projects).map((projectId) => projects[projectId].title);
        const data = Object.keys(projects).map((projectId) => projects[projectId].issues.length);

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
                        'rgba(255, 159, 64, 0.6)',
                    ],
                },
            ],
        };
    };

    if (!accessToken) {
        return <LoginPage onLogin={handleLogin} />;
    }

    if (loading) {
        return (
            <Box className="loading-container">
                <CircularProgress />
            </Box>
        );
    }

    const cleanMergeRequestTitle = (title) => {
        var cleanedTitle = title.replace('Draft: Resolve ', '');
        cleanedTitle = cleanedTitle.replace('WIP: Resolve ', '');
        return cleanedTitle;
      };
    
      const prepareLanguagePieData = (projects) => {
        let languageCounts = {};
        Object.keys(projects).forEach((projectId) => {
          projects[projectId].languages.forEach((lang) => {
            if (languageCounts[lang]) {
              languageCounts[lang]++;
            } else {
              languageCounts[lang] = 1;
            }
          });
        });
    
        const labels = Object.keys(languageCounts);
        const data = Object.values(languageCounts);
    
        return {
          labels,
          datasets: [
            {
              label: 'Number of       projects using this language',
            data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
            ],
          },
        ],
      };
    };

    return (
        <div className="main-content container">
        <h1 style={{ width: '100%' }}>GitLab Statistics</h1>
        <h2>Projects and Languages</h2>
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
        <h2 style={{ width: '100%' }}>Projects List</h2>
        {Object.keys(projects).map((projectId) => (
          <div key={projectId} className="card">
            <h2>{projects[projectId].title}</h2>
            <h3>Project Description:</h3>
            <p>{projects[projectId].description || 'not available'}</p>
            <h3>Issues I worked on:</h3>
            <p>Total: {projects[projectId].issues.length}</p>
            <h3>Project Languages:</h3>
            <p>
              {projects[projectId].languages.map((lang) => (
                <img
                  key={lang}
                  src={languageIcons[lang] || '/assets/languages/default.png'}
                  alt={lang}
                  title={lang}
                  className="language-icon"
                />
              ))}
            </p>
            {projects[projectId].issues.length > 0 && (
              <div>
                <h3>Last issues I worked on:</h3>
                <ul>
                  {projects[projectId].issues.slice(0, 4).map((issue) => (
                    <li key={issue.id}>{issue.title}</li>
                  ))}
                </ul>
              </div>
            )}
            {projects[projectId].mergeRequests.length > 0 && (
              <div>
                <h3>Partial Merge Requests History</h3>
                <ul>
                  {projects[projectId].mergeRequests.map((mr) => (
                    <li key={mr.id}>
                      <strong>{cleanMergeRequestTitle(mr.title)}</strong> - {mr.state} -{' '}
                      {new Date(mr.created_at).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    )}



export default App;
