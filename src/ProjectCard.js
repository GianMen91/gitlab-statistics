import React from 'react';
import languageIcons from './languageIcons';


const ProjectCard = ({ project }) => {
    const cleanMergeRequestTitle = (title) => {
        let cleanedTitle = title.replace('Draft: Resolve ', '');
        cleanedTitle = cleanedTitle.replace('WIP: Resolve ', '');
        return cleanedTitle;
    };

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
    );
};

export default ProjectCard;
