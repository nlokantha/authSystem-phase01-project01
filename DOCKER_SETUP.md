# Docker Setup Guide for Auth System

This guide walks you through dockerizing the Auth System project step by step.

## Prerequisites

- Docker Desktop installed (includes Docker and Docker Compose)
- Git
- No services running on ports 3000, 5432, or 6379

## Files Created

We've created the following Docker-related files:

1. **Dockerfile** - Multi-stage build for production
2. **.dockerignore** - Files to exclude from Docker build
3. **docker-compose.yml** - Development environment setup
4. **docker-compose.prod.yml** - Production environment setup
5. **.env.example** - Environment variables template

## Step 1: Understanding the Architecture

Your project consists of:
- **Node.js/Express Application** - API server
- **PostgreSQL** - Relational database
- **Redis** - Caching and session store

All three will run in separate containers that communicate via a Docker network.

## Step 2: Prepare Environment Variables

Create your `.env` file from the template:

```bash
cp .env.example .env
```

Update the `.env` file with your configurations (especially `JWT_SECRET` for production):

```env
DATABASE_URL=postgresql://authuser:authpassword@postgres:5432/authsystem
REDIS_URL=redis://redis:6379
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-key-change-this
```

## Step 3: Build and Run with Docker Compose (Development)

### Option A: Using the development compose file

```bash
# Start all services
docker-compose up

# In another terminal, run migrations (if needed)
docker-compose exec app npm run db:migrate

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (WARNING: deletes database)
docker-compose down -v
```

### Option B: Build in the background

```bash
# Start in detached mode
docker-compose up -d

# View running containers
docker-compose ps

# View logs
docker-compose logs -f app

# Stop all services
docker-compose stop
```

## Step 4: Build Docker Image Manually

If you want to build the image separately:

```bash
# Build the image
docker build -t authsystem:latest .

# Tag for registry (if needed)
docker tag authsystem:latest your-registry/authsystem:latest
```

## Step 5: Run Production Stack

```bash
# Using production compose file
docker-compose -f docker-compose.prod.yml up -d

# Check service health
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Step 6: Database Migrations

The first time you run the containers, you need to set up the database:

```bash
# Development
docker-compose exec app npm run db:migrate

# Production
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

## Step 7: Access Your Application

- **API Server**: http://localhost:3000
- **PostgreSQL**: localhost:5432
  - Username: `authuser`
  - Password: `authpassword`
  - Database: `authsystem`
- **Redis**: localhost:6379

## Common Docker Commands

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View container logs
docker logs <container-id>

# Execute command in running container
docker exec -it <container-id> sh

# Rebuild image after code changes
docker-compose build

# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all Docker resources (images, containers, volumes)
docker system prune -a
```

## Docker Compose Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove volumes too
docker-compose down -v

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app

# Rebuild services
docker-compose build

# Execute command in container
docker-compose exec app npm run build

# List services
docker-compose ps
```

## Troubleshooting

### Port Already in Use
```bash
# Find what's using the port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker-compose logs postgres

# Check network connectivity
docker-compose exec app ping postgres

# Verify DATABASE_URL in .env
```

### Redis Connection Failed
```bash
# Check if Redis is running
docker-compose logs redis

# Check network connectivity
docker-compose exec app redis-cli -h redis ping
```

### Rebuild Everything from Scratch
```bash
# Stop all containers and remove volumes
docker-compose down -v

# Remove images
docker rmi authsystem:latest

# Rebuild and start fresh
docker-compose up --build
```

## Development Tips

### Hot Reload Development
The development compose file includes:
- Volume mounts for `src` directory
- `npm run dev` command that watches for changes
- Changes to files in `src/` automatically trigger recompilation

Just save your files and refresh the browser!

### Database Inspection
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U authuser -d authsystem

# Common PostgreSQL commands:
# \dt - list tables
# \d table_name - describe table
# \q - exit
```

### Redis Inspection
```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Common Redis commands:
# KEYS * - list all keys
# GET key - get value
# FLUSHDB - clear database
# EXIT or Ctrl+C - exit
```

## Pushing to Registry

### Docker Hub
```bash
# Login to Docker Hub
docker login

# Tag image
docker tag authsystem:latest your-username/authsystem:latest

# Push
docker push your-username/authsystem:latest
```

### Private Registry
```bash
# Tag for private registry
docker tag authsystem:latest registry.example.com/authsystem:latest

# Push
docker push registry.example.com/authsystem:latest
```

## Production Deployment

For production deployments:

1. Use `docker-compose.prod.yml`
2. Set strong passwords in `.env`
3. Use environment variables for sensitive data
4. Enable restart policies (already included)
5. Configure health checks (already included)
6. Set up logging and monitoring
7. Use a reverse proxy (nginx) in front
8. Consider using Kubernetes for scaling

## Health Checks

The application includes health checks that:
- Run every 30 seconds
- Wait 40 seconds before first check
- Consider unhealthy after 3 failures
- Monitor HTTP endpoint: GET /health

## Next Steps

1. Start with: `docker-compose up`
2. Run migrations: `docker-compose exec app npm run db:migrate`
3. Test the API
4. For production: Switch to `docker-compose.prod.yml`

## Additional Resources

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose)
- [Best Practices for Node.js Docker](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
