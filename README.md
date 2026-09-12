# IEDC Project Management API

Full-stack IEDC project management application for registering college startup initiatives and tracking their progress.

The repository contains an Express/Prisma backend and a React/Vite frontend.

## Backend Track

The backend is built with:

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT authentication
- bcrypt password hashing

### Frontend

- React
- Vite

## Run the application

Open two terminals from the repository root.

Terminal 1, start the backend:

```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:5000` by default. Set `PORT` in `backend/.env` to change it.

Terminal 2, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server displays its local URL in the terminal. The frontend uses `http://localhost:5000` as its API URL by default. To use another backend URL, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

## Setup

```bash
cd backend
npm install
```

Create `backend/.env` and add the PostgreSQL connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=iedc&sslmode=require"
```

Apply the existing Prisma migrations:

```bash
npx prisma migrate deploy
```

Start the API in development mode:

```bash
npm run dev
```

The production start command is `npm start`.

## Authentication API

### Register

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
	"name": "Test User",
	"email": "test.user@iedc.dev",
	"password": "password123"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
	"email": "test.user@iedc.dev",
	"password": "password123"
}
```

Login returns a JWT token. Send it with protected project requests:

```http
Authorization: Bearer <token>
```

## Project API

### List projects

```http
GET /api/projects
```

Optional filters:

```http
GET /api/projects?status=IDEATION
GET /api/projects?domain=agriculture
GET /api/projects?status=PROTOTYPE&domain=healthcare
```

Supported project statuses are `IDEATION`, `PROTOTYPE`, and `SEED_FUNDED`.

### Get a project

```http
GET /api/projects/:id
```

Returns the project and team lead.

### Create a project

```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json
```

Required request body:

```json
{
	"title": "Smart Irrigation System",
	"domain": "Agriculture",
	"abstract": "An affordable system for monitoring soil moisture and controlling irrigation.",
	"status": "IDEATION"
}
```

The title, domain, and abstract are required. The authenticated user becomes the team lead. New projects use `IDEATION` status by default.

### Update project status

```http
PUT /api/projects/:id
Content-Type: application/json
Authorization: Bearer <token>
```

Request body:

```json
{
	"status": "PROTOTYPE"
}
```

### Delete a project

```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

Only the project owner can update or delete a project. Returns a successful response when the project is removed. Related project-member and RSVP records follow the deletion rules defined in the Prisma schema.

## Frontend features

After signing in, the frontend provides separate sections for:

- Overview: browse the public project registry.
- Create project: register a project under the signed-in account.
- My projects: view, filter, update status, and delete only your own projects.
- Project details: inspect a project and update status when you are its owner.

The overview and My projects sections support filtering by `status` and `domain`.

## Database and migrations

The Prisma schema is located at `backend/prisma/schema.prisma`. Migration files are stored in `backend/prisma/migrations/` and must be committed to version control. Do not add migrations to `.gitignore`; they are required to reproduce the database schema in another environment.

For local schema changes during development:

```bash
cd backend
npx prisma migrate dev --name describe_the_change
npx prisma generate
```

## Project structure

```text
backend/
├── prisma/
│   ├── migrations/
│   ├── db.js
│   └── schema.prisma
├── src/
├── prisma.config.js
├── server.js
└── package.json
frontend/
├── src/
│   ├── components/
│   │   ├── AuthPanel.jsx
│   │   ├── AppShell.jsx
│   │   ├── CreateProject.jsx
│   │   ├── MyProjects.jsx
│   │   ├── Overview.jsx
│   │   ├── ProjectDetails.jsx
│   │   ├── ProjectFilters.jsx
│   │   └── ProjectList.jsx
│   ├── lib/api.js
│   └── App.jsx
└── package.json
```

## Git and environment files

Never commit `backend/.env`, `frontend/.env`, or database credentials. Commit safe `.env.example` files containing variable names only. Keep `backend/prisma/migrations/` tracked.
