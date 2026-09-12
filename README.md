# Orbit

Orbit helps you ace your job search with AI-powered mock interview practice, while keeping every application you track neatly organized in one place.

## Features

- **Dashboard** — Get an overview of your job search progress at a glance.
- **Applications** — Track every job application you've submitted, along with their status.
- **Loggs** — Keep a log of activity and updates related to your job search.
- **History** — Review past AI mock interviews, including the job description used, the full transcript, and an AI-generated summary with scores.
- **AI Assistant** — Get AI-powered help throughout your job search workflow, from interview prep to application strategy.

## Tech Stack

- **Frontend** — Next.js, Tailwind CSS, TypeScript
- **Backend** — Express, Zod, TypeScript
- **Database** — PostgreSQL, Redis

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vansh-chauhan01/job_assist
```

### 2. Environment Setup

Create a `.env` file in the `backend` directory with the following variables:

```
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_SECRET_KEY=your_cloud_storage_secret_key
REDIS_URL=your_redis_connection_string
OPENAI_API_KEY=your_openai_api_key
```

Create a `.env` file in the `frontend` directory with the following variable:

```
NEXT_PUBLIC_BACKEND_URL="http://localhost:8080/api/v1"
```



### 3. Initialize the backend

```bash
cd backend
npm install
npm run build
npm run dev
```

### 4. Initialize the frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Run the app

Open [http://localhost:3000](http://localhost:3000) in your browser.

