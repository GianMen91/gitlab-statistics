import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import './App.css';

const GITLAB_API_URL = 'https://harbor.beamzone.net/api/v4';

function App() {
    const [accessToken, setAccessToken] = useState('');
    const [projects, setProjects] = useState({});
    const [loading, setLoading] = useState(true);
    const [assigneeId, setAssigneeId] = useState(null);

    const handleLogin = (token) => {
        setAccessToken(token);
        fetchAssigneeId(token);
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

    useEffect(() => {
        if (accessToken && assigneeId) {
            fetchIssuesAndProjects(accessToken);
        }
    }, [accessToken, assigneeId]);

    const fetchIssuesAndProjects = async (token) => {
        setLoading(true);
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
        } catch (error) {
            console.error('Error fetching issues and projects:', error);
            setLoading(false);
        }
    };

    if (!accessToken) {
        return <LoginPage onLogin={handleLogin} />;
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    return <Dashboard projects={projects} />;
}

export default App;
