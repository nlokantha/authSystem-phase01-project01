# Step-by-Step Docker Setup Guide

## Overview

This guide walks through dockerizing your Auth System in 10 easy steps.

---

## Step 1: Install Docker

### macOS
1. Download [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
2. Install and run Docker Desktop
3. Verify installation: `docker --version`

### Windows
1. Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
2. Install and enable WSL2 (Windows Subsystem for Linux)
3. Verify installation: `docker --version`

### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Verify
docker --version
docker-compose --version
```

---

## Step 2: Verify Docker is Working

```bash
# Run a test container
docker run hello-world

# Output should show: "Hello from Docker!"
```

---

## Step 3: Navigate to Project Directory

```bash
cd /path/to/authSystem-phase01-project01
```

---

## Step 4: Create Environment File

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings (optional for development)
# For now, defaults will work fine
```

---

## Step 5: Build the Docker Image

This step packages your application into a Docker image.

```bash
# Option A: Using helper script
./docker.sh build

# Option B: Using docker-compose
docker-compose build

# Option C: Using docker directly
docker build -t authsystem:latest .
```

**What happens:**
- Reads the Dockerfile
- Downloads Node.js base image
- Installs dependencies
- Compiles TypeScript
- Creates final production image

**Time:** 5-10 minutes first time (depends on internet speed)

---

## Step 6: Start All Containers

Now run your application with PostgreSQL and Redis.

```bash
# Option A: Using helper script
./docker.sh start

# Option B: Using docker-compose
docker-compose up -d

# Option C: View logs as it starts
docker-compose up
```

**What happens:**
1. PostgreSQL container starts
2. Redis container starts
3. Node.js application starts
4. All services connect via Docker network

**Time:** 10-20 seconds

---

## Step 7: Verify Services Are Running

```bash
# Option A: Using helper script
./docker.sh ps

# Option B: Using docker-compose
docker-compose ps

# Option C: Using docker directly
docker ps
```

**Expected output:**
```
NAME                    STATUS              PORTS
authsystem-postgres     Up (healthy)        5432/tcp
authsystem-redis        Up (healthy)        6379/tcp
authsystem-app          Up (healthy)        0.0.0.0:3000->3000/tcp
```

---

## Step 8: Run Database Migrations

Set up your database schema.

```bash
# Option A: Using helper script
./docker.sh migrate

# Option B: Using docker-compose
docker-compose exec -T app npm run db:deploy

# Option C: Generate Prisma client
docker-compose exec app npm run db:generate
```

**What happens:**
- Prisma applies all migrations to PostgreSQL
- Creates tables and relationships
- Sets up database schema

**Time:** 5-10 seconds

---

## Step 9: Test the Application

Verify everything is working.

### Test API
```bash
# Simple health check
curl http://localhost:3000/health

# Or open in browser
# http://localhost:3000
```

### View Logs
```bash
# Option A: Using helper script
./docker.sh logs app

# Option B: Using docker-compose
docker-compose logs -f app

# Option C: View specific service
docker-compose logs postgres  # Database logs
docker-compose logs redis     # Cache logs
```

### Connect to Database
```bash
# Option A: Using helper script
./docker.sh postgres

# Option B: Using docker-compose
docker-compose exec postgres psql -U authuser -d authsystem

# Inside psql:
# \dt - list tables
# \d table_name - describe table
# SELECT * FROM table_name; - query data
# \q - quit
```

### Connect to Redis
```bash
# Option A: Using helper script
./docker.sh redis

# Option B: Using docker-compose
docker-compose exec redis redis-cli

# Inside redis-cli:
# KEYS * - list all keys
# GET key - get value
# FLUSHDB - clear database
# EXIT - quit
```

---

## Step 10: Development Workflow

Now you can start developing with hot reload.

### Edit Code
```
src/
  ├── app.ts          ← Edit these
  ├── server.ts
  ├── modules/
  └── ...
```

### Changes Auto-Reload
1. Edit any file in `src/`
2. Save the file
3. Application automatically recompiles
4. Refresh browser to see changes

### Run Commands in Container
```bash
# Install new package
docker-compose exec app npm install package-name

# Run custom scripts
docker-compose exec app npm run build

# Access container shell
./docker.sh shell
```

---

## Common Tasks

### Stop Services (Keep Containers)
```bash
./docker.sh stop
# or
docker-compose stop
```

### Remove Containers
```bash
./docker.sh down
# or
docker-compose down
```

### Remove Everything (Including Database)
```bash
./docker.sh clean
# or
docker-compose down -v
```

### View Real-time Logs
```bash
./docker.sh logs       # All services
./docker.sh logs app   # Just application
```

### Rebuild After Dependencies Change
```bash
# If you update package.json
./docker.sh rebuild
# or
docker-compose build
docker-compose up -d
```

### Restart a Service
```bash
docker-compose restart app
# or
docker-compose up -d  # Restarts if needed
```

### Enter Application Shell
```bash
./docker.sh shell
# Now you can run any command
npm list
ls -la
pwd
exit  # Exit shell
```

---

## Troubleshooting

### Problem: "docker: command not found"
**Solution:** Docker is not installed or not in PATH
```bash
# Reinstall Docker
# Restart your terminal
# Or add Docker to PATH
```

### Problem: "Port 3000 already in use"
**Solution:** Something else is using the port
```bash
# Find what's using it
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change the port in docker-compose.yml
# Change: "3000:3000" to "3001:3000"
```

### Problem: "Cannot connect to database"
**Solution:** PostgreSQL not started yet
```bash
# Wait a few seconds
sleep 5

# Check status
docker-compose ps

# View logs
docker-compose logs postgres

# Restart
docker-compose restart postgres
```

### Problem: "Cannot connect to Redis"
**Solution:** Redis not started yet
```bash
# Wait a few seconds
sleep 5

# Check status
docker-compose ps

# View logs
docker-compose logs redis

# Restart
docker-compose restart redis
```

### Problem: "Out of disk space"
**Solution:** Docker images/containers use space
```bash
# Clean up unused images
docker image prune -a

# Clean up unused containers
docker container prune

# Clean up unused volumes
docker volume prune

# Or full cleanup
docker system prune -a
```

### Problem: "Permission denied" (Linux)
**Solution:** Need to run with sudo or add user to docker group
```bash
# Option A: Add user to docker group (recommended)
sudo usermod -aG docker $USER
newgrp docker

# Option B: Run with sudo
sudo docker-compose up
```

---

## Next Steps

### Development
1. ✅ Services running
2. ✅ Database ready
3. ✅ Cache configured
4. Start building features!

### Testing
```bash
# Run tests in container
docker-compose exec app npm test

# Or write tests in src/__tests__/
```

### Production Deployment
1. Update `.env` with production values
2. Use `docker-compose.prod.yml`
3. Deploy to hosting service (AWS, Heroku, DigitalOcean, etc.)

### Monitoring
- Add logging (Winston, Pino)
- Set up error tracking (Sentry)
- Monitor performance

---

## Useful Resources

### Docker Help
```bash
docker --help
docker-compose --help
```

### View Full Documentation
- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Comprehensive guide
- [DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md) - Quick reference

### External Resources
- [Docker Official Docs](https://docs.docker.com)
- [Docker Compose Docs](https://docs.docker.com/compose)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)

---

## Summary

You now have:
- ✅ Docker installed
- ✅ Project containerized
- ✅ PostgreSQL running
- ✅ Redis running
- ✅ Node.js API running
- ✅ Database migrations applied
- ✅ Hot reload working

**You're ready to develop!** 🚀

---

## Quick Reference Card

```
┌─────────────────────────────────────────────┐
│         Docker Quick Commands               │
├─────────────────────────────────────────────┤
│                                               │
│  Start:        ./docker.sh start             │
│  Stop:         ./docker.sh stop              │
│  Logs:         ./docker.sh logs app          │
│  Migrate:      ./docker.sh migrate           │
│  Shell:        ./docker.sh shell             │
│  Database:     ./docker.sh postgres          │
│  Cache:        ./docker.sh redis             │
│  Clean:        ./docker.sh clean             │
│                                               │
│  API:          http://localhost:3000         │
│                                               │
└─────────────────────────────────────────────┘
```

Enjoy containerized development! 🐳
