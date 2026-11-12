# 🐳 Docker Setup for Auth System

Your project has been fully dockerized! This file will get you started in seconds.

## ⚡ Quick Start (3 Commands)

```bash
# 1. Create environment file
cp .env.example .env

# 2. Start all services
./docker.sh start

# 3. Run database migrations
./docker.sh migrate
```

✅ **Done!** Visit http://localhost:3000

---

## 📖 Documentation

All documentation is organized in separate files:

| File | Purpose | Time |
|------|---------|------|
| **DOCKER_STEPS.md** | Step-by-step beginner guide | 5-10 min |
| **DOCKER_QUICKSTART.md** | Quick commands & reference | 2-5 min |
| **DOCKER_SETUP.md** | Comprehensive guide + troubleshooting | 10-20 min |
| **DOCKER_DIAGRAMS.md** | Visual architecture & flows | 5-10 min |
| **DOCKER.md** | Navigation index | 2-3 min |

**New to Docker?** → Start with [DOCKER_STEPS.md](./DOCKER_STEPS.md)

---

## 🎯 Commands Cheat Sheet

### Start/Stop Services

```bash
./docker.sh start      # Start services
./docker.sh stop       # Stop services
./docker.sh down       # Stop and remove containers
./docker.sh ps         # List running containers
```

### Logs & Debugging

```bash
./docker.sh logs app       # View app logs
./docker.sh logs postgres  # View database logs
./docker.sh logs redis     # View cache logs
./docker.sh logs           # View all logs
```

### Database & Cache

```bash
./docker.sh migrate    # Run database migrations
./docker.sh postgres   # Connect to PostgreSQL
./docker.sh redis      # Connect to Redis
./docker.sh shell      # Enter app container
```

### Maintenance

```bash
./docker.sh build      # Build Docker image
./docker.sh rebuild    # Full rebuild & restart
./docker.sh clean      # Remove everything
./docker.sh health     # Check container health
```

**Windows users:** Replace `docker.sh` with `docker.bat`

---

## 🏗️ What's Running

Three containerized services connected via Docker network:

```
Node.js Express (Port 3000)
    ↓
┌───────────────────────────┐
│ PostgreSQL (Port 5432)    │ (Database)
│ Redis (Port 6379)         │ (Cache)
└───────────────────────────┘
```

Access points:
- **API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

---

## 🔧 Development Workflow

1. **Start services once:**
   ```bash
   ./docker.sh start
   ```

2. **Edit code in `src/`** - changes automatically reload

3. **View logs:**
   ```bash
   ./docker.sh logs app
   ```

4. **Test API:**
   ```bash
   curl http://localhost:3000/api/users
   ```

5. **Stop when done:**
   ```bash
   ./docker.sh stop
   ```

---

## 🐛 Troubleshooting Quick Fixes

**Services won't start?**
```bash
docker-compose ps      # Check status
docker-compose logs    # View all logs
```

**Port already in use?**
```bash
lsof -i :3000  # Find process (macOS/Linux)
kill -9 <PID>  # Kill it
```

**Database connection failed?**
```bash
docker-compose restart postgres
docker-compose exec -T app npm run db:deploy
```

**Need full troubleshooting?** See [DOCKER_SETUP.md](./DOCKER_SETUP.md#troubleshooting)

---

## 📦 Files Created

### Configuration
- `Dockerfile` - Container build instructions
- `docker-compose.yml` - Development environment
- `docker-compose.prod.yml` - Production environment
- `.dockerignore` - Build exclusions
- `.env.example` - Environment template

### Scripts
- `docker.sh` - macOS/Linux helper script
- `docker.bat` - Windows helper script

### Documentation
- `DOCKER_STEPS.md` - Beginner guide (Start here!)
- `DOCKER_QUICKSTART.md` - Quick reference
- `DOCKER_SETUP.md` - Comprehensive guide
- `DOCKER_DIAGRAMS.md` - Visual diagrams
- `DOCKER.md` - Documentation index

---

## ✨ Key Features

✅ **Production Ready**
- Multi-stage optimized builds
- Security hardened
- Health checks configured
- Auto-restart on failure

✅ **Developer Friendly**
- Hot reload development
- Easy database access
- One-command startup
- Helper scripts included

✅ **Well Documented**
- 6 documentation files
- Step-by-step guides
- Architecture diagrams
- Complete troubleshooting

---

## 🚀 Next Steps

### Immediate
```bash
./docker.sh start
./docker.sh migrate
# Visit http://localhost:3000
```

### Learning
1. Read [DOCKER_STEPS.md](./DOCKER_STEPS.md)
2. Explore with `./docker.sh shell`
3. Check database with `./docker.sh postgres`

### Development
1. Edit code in `src/`
2. Watch logs: `./docker.sh logs -f app`
3. Test changes immediately

### Production
1. Update `.env` with real credentials
2. Use `docker-compose.prod.yml`
3. Deploy to your platform

---

## ❓ Need Help?

| Question | Answer |
|----------|--------|
| How do I start? | Run `./docker.sh start` |
| What commands are available? | Run `./docker.sh help` |
| How do I see logs? | Run `./docker.sh logs app` |
| Database won't connect? | See DOCKER_SETUP.md #Troubleshooting |
| Want to learn Docker? | Read DOCKER_STEPS.md |
| Need quick reference? | See DOCKER_QUICKSTART.md |

---

## 🎓 Documentation Map

```
README_DOCKER.md (You are here)
├── DOCKER_STEPS.md (Step-by-step guide) ⭐ START HERE
├── DOCKER_QUICKSTART.md (Quick reference)
├── DOCKER_SETUP.md (Comprehensive)
├── DOCKER_DIAGRAMS.md (Visual explanations)
└── DOCKER.md (Navigation index)
```

---

**Ready?** Run: `./docker.sh start` 🚀

Happy containerized development! 🐳
