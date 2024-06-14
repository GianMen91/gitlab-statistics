import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import LoginPage from '../loginPage/loginPage';
import Sidenav from '../sidenav/sidenav';
import Dashboard from '../dashboard/dashboard';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';
import './app.css';

const GITLAB_API_URL = 'https://harbor.beamzone.net/api/v4';

function App() {
    const [accessToken, setAccessToken] = useState('');
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState({});
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [sidenavOpen, setSidenavOpen] = useState(false);

    const handleLogin = (token) => {
        setAccessToken(token);
        fetchUserProfile(token);
        fetchIssuesAndProjects(token);
    };

    const fetchUserProfile = async (token) => {
        try {
            const response = await axios.get(`${GITLAB_API_URL}/user`, {
                headers: { 'PRIVATE-TOKEN': token },
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

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
                        assignee_id: user?.id,
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
                        assignee_id: user?.id,
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

    const handleLogout = () => {
        setAccessToken('');
        setUser(null);
    };

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    const toggleSidenav = () => {
        setSidenavOpen(prevState => !prevState);
    };

    if (!accessToken) {
        return <LoginPage onLogin={handleLogin} />;
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="hamburger-menu" onClick={toggleSidenav}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <Sidenav user={user} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} isActive={sidenavOpen} />
            <div className="content">
                <Dashboard projects={projects} />
            </div>
        </div>
    );
}

export default App;
