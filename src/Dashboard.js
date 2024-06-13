import React from 'react';
import Charts from './Charts';
import ProjectCard from './ProjectCard';

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
);

export default Dashboard;
