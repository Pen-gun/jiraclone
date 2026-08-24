# Project Management System (Jira Clone)

A modern, full-stack project management application inspired by Jira, built with Next.js, TypeScript, and AWS.

## 🚀 Features

### ✅ Core Functionality
- **Authentication & Authorization** - Secure session-based auth with cookie management
- **User Onboarding** - Complete profile setup with image uploads
- **Workspace Management** - Create, manage, and invite members to workspaces
- **Project Management** - Full CRUD operations for projects with cover images
- **Task Management** - Create, assign, and track tasks across projects
- **Member Management** - Role-based access control (Admin/Member)
- **Profile Pictures** - AWS S3 integration for user avatars and project images

### 🔧 Technical Features
- **Health Checks** - `/api/health`, `/api/ready`, `/api/live` endpoints for monitoring
- **API Documentation** - Auto-generated OpenAPI/Swagger docs at `/api/docs`
- **CI/CD Pipeline** - Automated deployment with health check validation
- **Docker Support** - Multi-stage builds with health checks
- **Database Migrations** - Automated with Prisma

---

## 📦 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **TanStack Query** - Server state management
- **React Hook Form + Zod** - Form validation

### Backend
- **Hono** - Fast, lightweight API framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Relational database
- **AWS S3** - Object storage for images

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD automation
- **Tailscale** - Secure deployment tunnel

---

## 🏗️ Project Structure

```
project-management-inspired-by-jira/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (sign-in, sign-up, onboarding)
│   ├── (dashboard)/              # Main app pages
│   ├── (standalone)/             # Standalone pages (workspace create, join)
│   └── api/                      # API routes
│       ├── [...route]/           # Hono API routes
│       ├── health/               # Health check endpoint
│       ├── ready/                # Readiness probe
│       ├── live/                 # Liveness probe
│       └── images/               # Image proxy for S3
│
├── features/                     # Feature modules
│   ├── auth/                     # Authentication
│   ├── workspaces/               # Workspace management
│   ├── projects/                 # Project management
│   ├── members/                  # Member management
│   └── uploads/                  # Image upload (S3)
│       ├── api/                  # React Query hooks
│       ├── components/           # Upload components
│       ├── server/               # API routes
│       └── schemas.ts            # Zod schemas
│
├── components/                   # Shared components
│   ├── ui/                       # shadcn components
│   └── user-avatar.tsx           # User avatar component
│
├── lib/                          # Utilities
│   ├── prismaHelper.ts           # Prisma client
│   ├── session-middelware.ts     # Auth middleware
│   ├── s3.ts                     # AWS S3 utilities
│   └── utils.ts                  # Shared utilities
│
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Migration history
│
├── lambda/                       # AWS Lambda
│   └── image-processor/          # Image processing function
│
├── .github/workflows/            # CI/CD
│   └── docker-image.yml          # Build & deploy pipeline
│
├── docker-compose.yml            # Local development
├── Dockerfile                    # Production image
└── AWS_INTEGRATION.md            # AWS setup guide
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- AWS Account (for image uploads)

### 1. Clone & Install

```bash
git clone <repository-url>
cd project-management-inspired-by-jira
npm install
```

### 2. Environment Setup

Create `.env` file:

```env
# Database (for local development)
DATABASE_URL="postgresql://notpenguin:13717893@localhost:5432/project_management?schema=public"
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Docker variables
POSTGRES_USER=notpenguin
POSTGRES_PASSWORD=13717893
POSTGRES_DB=project_management

# AWS Configuration (for image uploads)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET_NAME=jiraclone-uploads
```

See `AWS_INTEGRATION.md` for AWS setup instructions.

### 3. Start Database

```bash
docker compose up -d database
```

### 4. Run Migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📚 API Documentation

### Health Check Endpoints

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `GET /api/health` | Full health check with DB & AWS status | `200` if healthy, `503` if unhealthy |
| `GET /api/ready` | Readiness probe (DB connectivity) | `200` if ready, `503` if not ready |
| `GET /api/live` | Liveness probe (process running) | Always `200` |

Example response from `/api/health`:
```json
{
  "status": "healthy",
  "timestamp": "2026-08-24T20:59:33.002Z",
  "uptime": 243.54,
  "services": {
    "database": "connected",
    "aws": "configured"
  },
  "version": "0.1.0"
}
```

### OpenAPI Documentation

- **Swagger UI**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **OpenAPI JSON**: [http://localhost:3000/api/openapi.json](http://localhost:3000/api/openapi.json)

### Main API Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces` - List workspaces
- `POST /api/projects` - Create project
- `GET /api/members` - List workspace members
- `POST /api/uploads/presigned-url` - Get upload URL
- `POST /api/uploads/confirm` - Confirm upload

---

## 🐳 Docker Deployment

### Development

```bash
docker compose up -d
```

### Production Build

```bash
docker compose up -d --build
```

### Health Checks

The app includes Docker health checks:
- Application: `curl -f http://localhost:3000/api/health`
- Database: `pg_isready`

---

## 🔄 CI/CD Pipeline

The project uses GitHub Actions for automated deployment:

1. **CI (Continuous Integration)**
   - Build Docker image
   - Push to GitHub Container Registry

2. **CD (Continuous Deployment)**
   - Deploy via SSH over Tailscale
   - Pull latest image
   - Restart containers
   - Run health checks (with retries)
   - Validate readiness

### Deployment Flow

```
Push to master → Build Image → Push to GHCR → Deploy to Server → Health Check → ✅
```

See `.github/workflows/docker-image.yml` for details.

---

## 🖼️ AWS S3 Integration

### Setup

1. Create S3 bucket
2. Create IAM user with S3 permissions
3. Enable ACLs on bucket (Object Ownership → ACLs enabled)
4. Update `.env` with credentials

See **[AWS_INTEGRATION.md](./AWS_INTEGRATION.md)** for complete setup guide.

### Features

- **Profile Pictures** - User avatars with fallback to initials
- **Project Images** - Cover images for projects
- **Secure Upload** - Presigned URLs (15min expiry)
- **Automatic Cleanup** - Old images deleted on update
- **Image Proxy** - `/api/images/...` endpoint for access control

### Optional: Lambda Image Processing

Deploy Lambda function for automatic:
- Thumbnail generation (200x200)
- Image optimization (max 1024px)

See `lambda/image-processor/` directory.

---

## 📊 Database Schema

### Key Models

- **User** - Authentication, profile, images
- **Workspace** - Team spaces with invite codes
- **WorkspaceMember** - Role-based membership (Admin/Member)
- **Project** - Projects with cover images
- **Task** - Tasks with assignees
- **Comment** - Task comments
- **Session** - Cookie-based sessions

See `prisma/schema.prisma` for complete schema.

---

## 🧪 Testing

### Health Check Test

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/ready
curl http://localhost:3000/api/live
```

### Manual Testing

1. Sign up at `/sign-up`
2. Complete onboarding at `/onboarding`
3. Upload profile picture
4. Create workspace at `/workspaces/create`
5. Invite members
6. Create projects and tasks

---

## 🔐 Authentication

### Architecture

1. **Register/Login** → Creates `Session` record → Sets `auth_token` cookie
2. **Session Middleware** → Reads cookie → Resolves user from DB
3. **Protected Routes** → Require valid session
4. **Logout** → Deletes session → Clears cookie

### Session Management

- Cookie-based sessions
- Server-side session validation
- Automatic session cleanup
- 7-day expiry

---

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (DB GUI)
npx prisma migrate dev  # Run migrations
```

---

## 🚧 Known Limitations

- **Password Security** - Using bcrypt, but consider Argon2 for production
- **Image Storage** - S3 bucket must allow ACLs for public read
- **Session Rotation** - Not yet implemented
- **Rate Limiting** - Not yet implemented
- **Tests** - Integration tests pending

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Authentication & sessions
- [x] Workspace management
- [x] Project CRUD
- [x] Member management
- [x] AWS S3 integration
- [x] Health checks
- [x] CI/CD pipeline

### Phase 2: Enhancement 🚧
- [ ] Task board UI (Kanban)
- [ ] Real-time updates (WebSockets)
- [ ] Email notifications
- [ ] Advanced search
- [ ] Activity feed
- [ ] File attachments (beyond images)

### Phase 3: Scale 📅
- [ ] Redis caching
- [ ] Rate limiting
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Audit logs

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is for educational purposes.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [Hono](https://hono.dev/)
- [AWS](https://aws.amazon.com/)

---

## 📞 Support

- 📖 **Documentation**: Check `AWS_INTEGRATION.md` for AWS setup
- 🐛 **Issues**: Open an issue on GitHub
- 💬 **Discussions**: Use GitHub Discussions

---

**Built with ❤️ using Next.js and AWS**
