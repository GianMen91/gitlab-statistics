//use nvm install v22.2.0 in case of error

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ACCESS_TOKEN = 'jJaUzHfSsSscFFK5XkBA'; // Your access token
const GITLAB_API_URL = 'https://harbor.beamzone.net/api/v4';
const ASSIGNEE_ID = 46; // Your assignee ID

function App() {
    const [projects, setProjects] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssuesAndProjects = async () => {
            try {
                let allIssues = [];
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
            } catch (error) {
                console.error('Error fetching issues and projects:', error);
                setLoading(false); // Set loading to false in case of error
            }
        };

        fetchIssuesAndProjects();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>GitLab Statistics</h1>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <div>
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
                )}
            </header>
        </div>
    );
}

export default App;

