# ✅ Docker Setup Checklist

Your project has been dockerized! Use this checklist to get started.

## Pre-Flight Checklist

- [ ] Docker Desktop installed and running
- [ ] Project folder open in terminal
- [ ] Internet connection available (for first-time image download)

## Setup Steps

### Step 1: Environment Setup
- [ ] Copy environment file: `cp .env.example .env`
- [ ] Review `.env` file (defaults are fine for development)
- [ ] Save the file

### Step 2: Start Services
- [ ] Run: `./docker.sh start` (or `docker.bat start` on Windows)
- [ ] Wait 15-20 seconds for services to start
- [ ] Run: `./docker.sh ps` and verify all 3 containers are "Up"

### Step 3: Database Migrations
- [ ] Run: `./docker.sh migrate`
- [ ] Wait for migration to complete
- [ ] Verify no errors in output

## Verification Steps

### Test API Server
- [ ] Run: `curl http://localhost:3000` (or visit in browser)
- [ ] Should receive response (or 404 if no route)
- [ ] ✅ API is running

### Test Database Connection
- [ ] Run: `./docker.sh postgres`
- [ ] Type: `\dt` (list tables)
- [ ] Type: `\q` (quit)
- [ ] ✅ Database is working

### Test Redis Connection
- [ ] Run: `./docker.sh redis`
- [ ] Type: `PING`
- [ ] Should respond with: `PONG`
- [ ] Type: `EXIT`
- [ ] ✅ Redis is working

### Check Logs
- [ ] Run: `./docker.sh logs app`
- [ ] Should show "Server listening on port 3000"
- [ ] No error messages
- [ ] ✅ Application started correctly

## Development Setup

### Enable Hot Reload
- [ ] Verify docker-compose.yml has volume mount: `./src:/app/src`
- [ ] Edit a file in `src/` and save
- [ ] Run: `./docker.sh logs app`
- [ ] Should see recompilation messages
- [ ] ✅ Hot reload is working

### Database Inspection
- [ ] Run: `./docker.sh postgres`
- [ ] Type: `\dt` to list tables
- [ ] Type: `SELECT * FROM table_name;` to query data
- [ ] ✅ Can inspect and query database

### Cache Testing
- [ ] Run: `./docker.sh redis`
- [ ] Type: `KEYS *` to list cache keys
- [ ] ✅ Redis is accessible

## Documentation Review

- [ ] Read: `README_DOCKER.md` (quick overview)
- [ ] Skim: `DOCKER_QUICKSTART.md` (commands reference)
- [ ] Bookmark: `DOCKER_STEPS.md` (for learning)
- [ ] Know about: `DOCKER_SETUP.md` (for troubleshooting)

## Regular Development Tasks

### Daily Startup
- [ ] Run: `./docker.sh start`
- [ ] Run: `./docker.sh migrate` (if needed)
- [ ] Start coding!

### Viewing Logs
- [ ] For debugging: `./docker.sh logs app`
- [ ] Real-time logs: `./docker.sh logs -f app`
- [ ] All services: `./docker.sh logs`

### Database Work
- [ ] Connect: `./docker.sh postgres`
- [ ] Query data
- [ ] Disconnect: `\q`

### Stopping Work
- [ ] Run: `./docker.sh stop`
- [ ] Or: `./docker.sh down` (to remove containers)
- [ ] Data persists in volumes

## Production Checklist

- [ ] Update credentials in `.env` file
- [ ] Change JWT_SECRET to strong value (32+ chars)
- [ ] Change database password
- [ ] Change Redis password if needed
- [ ] Test with: `docker-compose -f docker-compose.prod.yml up -d`
- [ ] Verify: `docker-compose -f docker-compose.prod.yml ps`
- [ ] Review: DOCKER_SETUP.md #Production Deployment section

## Troubleshooting Checklist

### If Services Won't Start
- [ ] Run: `docker-compose ps` (check status)
- [ ] Run: `docker-compose logs` (view errors)
- [ ] Run: `./docker.sh clean` (full restart)
- [ ] Run: `./docker.sh start` (start fresh)

### If Port is Already in Use
- [ ] Run: `lsof -i :3000` (macOS/Linux)
- [ ] Run: `netstat -ano | findstr :3000` (Windows)
- [ ] Kill the process or change port in docker-compose.yml

### If Database Connection Fails
- [ ] Wait a few seconds: `sleep 10`
- [ ] Check status: `./docker.sh ps`
- [ ] View logs: `docker-compose logs postgres`
- [ ] Restart: `docker-compose restart postgres`

### If Everything is Broken
- [ ] Stop services: `./docker.sh down`
- [ ] Remove volumes: `docker-compose down -v`
- [ ] Remove images: `docker rmi authsystem:latest`
- [ ] Start fresh: `./docker.sh start`
- [ ] See DOCKER_SETUP.md for more help

## Final Verification

Run this command to verify everything:

```bash
./docker.sh health
```

You should see:
```
✓ PostgreSQL is healthy
✓ Redis is healthy  
✓ App container is healthy
```

---

## You're Ready! 🚀

All systems operational! You can now:

- ✅ Edit code in `src/` (auto-reloads)
- ✅ Query database with `./docker.sh postgres`
- ✅ Monitor logs with `./docker.sh logs`
- ✅ Test API at `http://localhost:3000`
- ✅ Deploy to production when ready

---

## Quick Reference

| Task | Command |
|------|---------|
| Start | `./docker.sh start` |
| Stop | `./docker.sh stop` |
| Logs | `./docker.sh logs app` |
| Database | `./docker.sh postgres` |
| Cache | `./docker.sh redis` |
| Shell | `./docker.sh shell` |
| Rebuild | `./docker.sh rebuild` |
| Help | `./docker.sh help` |

**For Windows:** Replace `docker.sh` with `docker.bat`

---

## Resources

- 📖 Documentation: `DOCKER.md`
- 🚀 Quick Start: `README_DOCKER.md`
- 📋 Commands: `DOCKER_QUICKSTART.md`
- 🎓 Learning: `DOCKER_STEPS.md`
- 🐛 Troubleshooting: `DOCKER_SETUP.md`
- 📊 Diagrams: `DOCKER_DIAGRAMS.md`

---

**All checked? Happy coding!** 🎉
