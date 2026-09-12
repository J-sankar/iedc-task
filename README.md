# IEDC Project Management API

REST API for managing college startup projects, team registrations, and related IEDC activities.

## Backend Track

The backend is built with:

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Zod validation

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

Start the API:

```bash
npm start
```

The server runs on `http://localhost:3000`.

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

Returns the project, team lead, and registered members.

### Create a project

```http
POST /api/projects
Content-Type: application/json
```

Required request body:

```json
{
	"title": "Smart Irrigation System",
	"domain": "Agriculture",
	"teamLeadId": "user-uuid",
	"abstract": "An affordable system for monitoring soil moisture and controlling irrigation."
}
```

The title, domain, team lead, and abstract are required. New projects use `IDEATION` status by default.

### Update project status

```http
PUT /api/projects/:id
Content-Type: application/json
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
```

Returns a successful response when the project is removed. Related project-member and RSVP records follow the deletion rules defined in the Prisma schema.

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
```

## Git and environment files

Never commit `backend/.env` or database credentials. Commit a safe `.env.example` containing variable names only. Keep `backend/prisma/migrations/` tracked.
