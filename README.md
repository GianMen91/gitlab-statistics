# GitLab Statistics Dashboard

A dashboard application built with React to display GitLab statistics using [GitLab APIs](https://docs.gitlab.com/ee/api/api_resources.html), including merge requests, project details, and issue timelines.

https://github.com/GianMen91/gitlab-statistics/assets/26220496/a03af0bf-ca63-4152-a619-cd024fba8983

## Overview

This dashboard application fetches data from the GitLab API to provide statistics about closed issues, merge requests, and project details for a specific assignee. It visualizes the data using React components and Chart.js.

## Technologies Utilized

### Frontend

- **React**: The entire project is built using React, taking advantage of its component-based architecture for a modular and scalable codebase.

- **ESLint and Stylelint**: Code quality is maintained through the integration of ESLint for JavaScript and Stylelint for styles. This ensures adherence to best practices and coding standards.

## Installation

1. Clone the repository:

`git clone https://github.com/GianMen91/gitlab-statistics.git`

2. Install dependencies:

`npm install`

3. Get or create your GitLab access token

- Log in to your GitLab account.
- Navigate to your profile settings by clicking on your avatar in the top right corner and selecting Settings.
- In the left sidebar, click on Access Tokens.
- Give your token a name, select the desired scopes (e.g., api), and click Create personal access token.
- Copy the generated token and keep it safe. You'll need it for the next step.

Open the project in your preferred code editor and navigate to the App.js file. Replace the placeholder access token with your actual GitLab access token:

`const ACCESS_TOKEN = 'your-access-token'; // Replace 'your-access-token' with your actual GitLab access token`

5. Start the development server:

`npm start`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage

- Upon loading the application, it will fetch data from the GitLab API and display statistics about closed issues, merge requests, and project details for the specified assignee.
- The dashboard provides a clean and organized interface for recruiters to view the assignee's contributions and project involvement.

## Contributing

Contributions from users are highly valued and appreciated. There are two main ways to contribute to this project: through pull requests and issues.

### Pull Requests

1. Fork the repository and create a branch from the `main` branch.
2. Make changes or additions to the code.
3. Commit the changes, and push them to the branch.
4. Open a pull request to the `main` branch with a clear and concise description of the changes.

### Issues

1. Navigate to the [Issues](https://github.com/GianMen91/gitlab-statistics/issues) section of the repository.
2. Check if there is an existing issue similar to the one you'd like to create.
3. If there isn't an existing issue, create a new issue by clicking the "New issue" button.
4. Provide a descriptive title and detailed information about the proposed changes that you want to potentially add to the current script.

---

Feel free to contribute and share

## Troubleshooting

Use nvm install v22.2.0 in case of error

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
