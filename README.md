# MediBook 🏥

### Medical Clinic Appointment Management Platform

MediBook is a responsive front-end web application designed to simplify the process of discovering medical specialists and managing appointment-related tasks.

The project provides a user-friendly interface for exploring doctors, searching by name or specialty, and navigating medical appointment information. It was developed as part of a front-end development project, with a focus on reusable React components, responsive design, accessibility, and code maintainability.

**Live Demo:** https://takkh19.github.io/MediBook/  
**GitHub Repository:** https://github.com/takkh19/MediBook

---

## ✨ Features

- **Doctor Directory** — Browse sample medical specialists and their information.
- **Search and Filtering** — Find doctors by name or specialty.
- **Responsive Interface** — Layout designed to adapt to different screen sizes.
- **Reusable Components** — Shared React components for a consistent interface.
- **Client-Side Routing** — Navigate between application pages using React Router.
- **Form Validation** — Validate supported form data using Zod.
- **Loading and Error Handling** — Provide feedback during loading and recover from supported runtime errors.
- **Demo Data Fallback** — Display local demonstration data when the external doctor data source is unavailable.
- **Performance Improvements** — Apply component memoization and lazy loading where appropriate.
- **Accessible UI** — Use semantic HTML and visible keyboard-focus indicators.

> **Note:** This is a front-end demonstration project. Sample doctor information is not verified medical-provider data. Demonstration functionality should not be interpreted as a production medical booking service.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| JavaScript (ES Modules) | Application logic |
| Vite | Development server and production build |
| React Router | Client-side navigation |
| Zod | Data validation |
| HTML5 | Semantic page structure |
| CSS3 | Styling and responsive layouts |
| Git and GitHub | Version control and source-code hosting |
| GitHub Pages | Hosting the published front-end application |

## 🚀 Getting Started

### Prerequisites

Make sure the following tools are installed:

- Node.js — a version compatible with the project's Vite dependencies
- npm
- Git

Check your installed versions:

```bash
node --version
npm --version
git --version
```

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/takkh19/MediBook.git
```

**2. Open the project directory**

```bash
cd MediBook
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the local application**

Vite will display the local development URL in the terminal. Open that URL in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint to check code quality |

## 📁 Project Structure

```text
MediBook/
├── public/                 # Public static assets
├── src/
│   ├── assets/             # Images and other imported assets
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── Pages/              # Application pages
│   ├── services/           # Data access and service logic
│   ├── App.jsx             # Application routes and main layout
│   ├── App.css             # Application styles
│   └── main.jsx            # Application entry point
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## 📱 Responsive Design

The interface should be checked at the following viewport categories:

- **Mobile:** approximately 375–430 px wide
- **Tablet:** approximately 768–1024 px wide
- **Desktop:** 1280 px wide and above

Responsive checks should cover navigation, doctor cards, search controls, forms, buttons, images, and page spacing.

## 🌐 Cross-Browser Compatibility

The application should be tested in the following browsers:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge

The testing process should verify that the layout, navigation, doctor search, supported forms, and interactive components behave consistently.

Responsive testing can be performed with Chrome DevTools Device Mode.

Record the actual test results before submitting the project.

## 🧹 Code Quality and Repository Hygiene

The project uses ESLint to identify potential code-quality issues.

Run the following checks before publishing changes:

```bash
npm run lint
npm run build
```

The repository should exclude generated dependencies, build output, local environment files, and other machine-specific files through `.gitignore`.

## 🔒 Environment Variables and Security

Never commit secrets, credentials, API keys, or private environment configuration to a public repository.

If environment variables are needed for local development, keep them in a local `.env` file and exclude that file from Git.

## 📦 Deployment

MediBook is published through GitHub Pages.

After updating the source code, verify that the production build succeeds and that the published website loads correctly.

**Live application:** https://takkh19.github.io/MediBook/

## 🎯 Project Goals

This project demonstrates practical front-end development skills, including:

- Building a modular React application
- Creating reusable UI components
- Managing routes and application state
- Implementing search and validation
- Improving rendering performance
- Handling loading and error states
- Maintaining responsive layouts
- Using Git and GitHub for version control
- Documenting installation, development, and testing procedures

## ⚠️ Disclaimer

MediBook is an educational front-end project. The sample data and demonstration workflows are not a substitute for a verified healthcare service. Do not use the application to make medical decisions or assume that a real appointment has been booked.

## 👩‍💻 Author

**Tako Khatridze**

GitHub: https://github.com/takkh19