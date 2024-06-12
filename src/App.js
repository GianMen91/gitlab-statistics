import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import 'chartjs-adapter-date-fns';
import { Bar } from 'react-chartjs-2';

import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './App.css';

const ACCESS_TOKEN = 'jJaUzHfSsSscFFK5XkBA'; // Your access token
const GITLAB_API_URL = 'https://harbor.beamzone.net/api/v4';
const ASSIGNEE_ID = 46; // Your assignee ID

function App() {
    const [projects, setProjects] = useState({});
    const [loading, setLoading] = useState(true);
    const [issueTimelineData, setIssueTimelineData] = useState(null);
    const [contributionData, setContributionData] = useState([]);
    const [mergeRequests, setMergeRequests] = useState([]);

    useEffect(() => {
        const fetchIssuesAndProjects = async () => {
            try {
                let allIssues = [];
                let allMergeRequests = [];
                let page = 1;
                let totalPages = 1;

                while (page <= totalPages) {
                    const response = await axios.get(`${GITLAB_API_URL}/issues`, {
                        headers: { 'PRIVATE-TOKEN': ACCESS_TOKEN },
                        params: {
                            assignee_id: ASSIGNEE_ID,
                            state: 'closed',
                            per_page: 100,
                            page,
                            order_by: 'created_at',
                            sort: 'desc'
                        }
                    });

                    allIssues = [...allIssues, ...response.data];

                    // GitLab includes pagination info in headers
                    totalPages = parseInt(response.headers['x-total-pages'], 10) || 1;
                    page += 1;
                }

                page = 1;
                totalPages = 1;
                while (page <= totalPages) {
                    const response = await axios.get(`${GITLAB_API_URL}/merge_requests`, {
                        headers: { 'PRIVATE-TOKEN': ACCESS_TOKEN },
                        params: {
                            assignee_id: ASSIGNEE_ID,
                            state: 'closed',
                            per_page: 100,
                            page,
                            order_by: 'created_at',
                            sort: 'desc'
                        }
                    });

                    allMergeRequests = [...allMergeRequests, ...response.data];

                    // GitLab includes pagination info in headers
                    totalPages = parseInt(response.headers['x-total-pages'], 10) || 1;
                    page += 1;
                }

                // Fetch project details for each issue and group issues by project
                const projectsMap = {};
                for (const issue of allIssues) {
                    const projectId = issue.project_id;
                    if (!projectsMap[projectId]) {
                        const projectResponse = await axios.get(`${GITLAB_API_URL}/projects/${projectId}`, {
                            headers: { 'PRIVATE-TOKEN': ACCESS_TOKEN }
                        });

                        // Fetch languages for the project
                        const languagesResponse = await axios.get(`${GITLAB_API_URL}/projects/${projectId}/languages`, {
                            headers: { 'PRIVATE-TOKEN': ACCESS_TOKEN }
                        });

                        projectsMap[projectId] = {
                            title: projectResponse.data.name,
                            description: projectResponse.data.description,
                            languages: Object.keys(languagesResponse.data),
                            issues: []
                        };
                    }
                    projectsMap[projectId].issues.push(issue);
                }

                setProjects(projectsMap);
                setLoading(false); // Set loading to false once data is fetched

                // Prepare issue timeline data
                const timelineData = prepareIssueTimelineData(allIssues);
                setIssueTimelineData(timelineData);

                // Prepare contribution data
                const contributionData = prepareContributionData(allIssues);
                setContributionData(contributionData);

                // Set merge requests data
                setMergeRequests(allMergeRequests);

            } catch (error) {
                console.error('Error fetching issues and projects:', error);
                setLoading(false); // Set loading to false in case of error
            }
        };

        fetchIssuesAndProjects();
    }, []);

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

        return Object.keys(contributions).map(date => ({
            date,
            count: contributions[date]
        }));
    };

    return (
        <div className="App">
            <header className="header">
                <h1>GitLab Statistics</h1>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                        <CircularProgress />
                    </Box>
                ) : (
                <div className="main-content container">
                    <div>
                        <div>
                            <h2>Partial Merge Request History</h2>
                            <ul>
                                {mergeRequests.map(mr => (
                                    <li key={mr.id}>
                                        <strong>{mr.title}</strong> - {mr.state} - {new Date(mr.created_at).toLocaleDateString()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {Object.keys(projects).map(projectId => (
                            <div key={projectId}>
                                <h2>{projects[projectId].title}</h2>
                                <p>Project Description: {projects[projectId].description}</p>
                                <p>Project Languages: {projects[projectId].languages.join(', ')}</p>
                                <p>Total Issues I worked on: {projects[projectId].issues.length}</p>
                                {projects[projectId].issues.length > 0 && (
                                    <div>
                                        <h3>Last issues I worked on:</h3>
                                        <ul>
                                            {projects[projectId].issues.slice(0, 4).map(issue => (
                                                <li key={issue.id}>{issue.title}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                     </div>
                )}
            </header>
        </div>
    );
}

export default App;
