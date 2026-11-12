# 🐳 Docker Documentation Index

Welcome! This folder contains complete Docker documentation for the Auth System project.

## 📚 Documentation Files

### 1. **DOCKER_STEPS.md** ⭐ START HERE
   - **For:** Beginners and first-time users
   - **Contains:** 10-step walkthrough
   - **Time:** 5-10 minutes
   - **Learn:** How to set up Docker from scratch
   - **Read this first!**

### 2. **DOCKER_QUICKSTART.md** 🚀
   - **For:** Quick reference and ongoing development
   - **Contains:** Quick start guide and common commands
   - **Time:** 2-5 minutes
   - **Learn:** How to get started immediately

### 3. **DOCKER_SETUP.md** 📖
   - **For:** Deep dive and troubleshooting
   - **Contains:** 200+ lines of comprehensive guide
   - **Time:** 10-20 minutes to read through
   - **Learn:** Everything about Docker configuration

## 🎯 Quick Navigation

### "I'm new to Docker"
→ Read: [DOCKER_STEPS.md](./DOCKER_STEPS.md)

### "I just want to start coding"
→ Run: `./docker.sh start` then read [DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md)

### "I need to troubleshoot something"
→ Check: [DOCKER_SETUP.md](./DOCKER_SETUP.md#troubleshooting)

### "I want production setup"
→ See: [DOCKER_SETUP.md](./DOCKER_SETUP.md#production-deployment)

---

## 🚀 30-Second Quick Start

```bash
# 1. Set up environment
cp .env.example .env
# Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in .env to different,
# unpredictable values of at least 32 characters each.

# 2. Start everything
./docker.sh start

# 3. Run migrations
./docker.sh migrate

# 4. Done! Visit http://localhost:3000
```

The development image includes TypeScript, Prisma, and the generated client;
source changes are reloaded automatically. The migration command applies the
existing migrations without creating new ones. For production, apply migrations
using the development image against the production database before deployment;
the production image does not include the Prisma CLI.

If host port 5432 is already in use, set `POSTGRES_PORT=5433` in `.env`
(or another available port) before starting. Host database clients should then
connect to `localhost:5433`; the app still connects to `postgres:5432` inside
the Docker network. This does not affect the existing database on port 5432.

---

## 📦 Files Created for Docker

| File | Purpose |
|------|---------|
| `Dockerfile` | Container build instructions |
| `.dockerignore` | Files to exclude from build |
| `docker-compose.yml` | Development environment |
| `docker-compose.prod.yml` | Production environment |
| `.env.example` | Environment variables template |
| `docker.sh` | Helper script (macOS/Linux) |
| `docker.bat` | Helper script (Windows) |

---

## 🔧 Helper Scripts

### macOS/Linux
```bash
./docker.sh start      # Start containers
./docker.sh stop       # Stop containers
./docker.sh logs       # View logs
./docker.sh migrate    # Run migrations
./docker.sh postgres   # Connect to database
./docker.sh redis      # Connect to cache
./docker.sh shell      # Enter app shell
```

### Windows
```bash
docker.bat start       # Start containers
docker.bat stop        # Stop containers
docker.bat logs        # View logs
docker.bat migrate     # Run migrations
docker.bat postgres    # Connect to database
docker.bat redis       # Connect to cache
docker.bat shell       # Enter app shell
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│       Docker Network                     │
├─────────────────────────────────────────┤
│                                           │
│  ┌────────────────┐  ┌────────────────┐  │
│  │  Node.js App   │  │  PostgreSQL    │  │
│  │  Port: 3000    │  │  Port: 5432    │  │
│  └────────┬───────┘  └────────────────┘  │
│           │                               │
│           └─────────┬─────────────────┐   │
│                     │                 │   │
│              ┌──────▼──────┐          │   │
│              │   Redis     │          │   │
│              │  Port: 6379 │          │   │
│              └─────────────┘          │   │
│                                       │   │
│  Volumes:                              │   │
│  - postgres_data (database)           │   │
│  - redis_data (cache)                 │   │
│  - src/ (live code reload)            │   │
│                                           │
└─────────────────────────────────────────┘
```

---

## 📋 Service Information

### PostgreSQL Database
- **Container:** authsystem-postgres
- **Port:** 5432
- **User:** authuser
- **Password:** authpassword (change in production!)
- **Database:** authsystem
- **Volume:** postgres_data

### Redis Cache
- **Container:** authsystem-redis
- **Port:** 6379
- **Persistence:** Enabled
- **Volume:** redis_data

### Node.js Application
- **Container:** authsystem-app
- **Port:** 3000
- **Environment:** Development or Production
- **Health Check:** /health endpoint

---

## ✅ Checklist

- [ ] Docker Desktop installed
- [ ] Verified Docker works (`docker --version`)
- [ ] Read [DOCKER_STEPS.md](./DOCKER_STEPS.md)
- [ ] Created `.env` file
- [ ] Started containers (`./docker.sh start`)
- [ ] Ran migrations (`./docker.sh migrate`)
- [ ] Verified services running (`./docker.sh ps`)
- [ ] Tested API (`curl http://localhost:3000`)
- [ ] Connected to database (`./docker.sh postgres`)
- [ ] Ready to develop!

---

## 🆘 Common Issues

### Services won't start
```bash
./docker.sh logs        # View all logs
./docker.sh ps          # Check status
docker-compose rebuild  # Rebuild if needed
```

### Port already in use
```bash
lsof -i :3000  # Find process
kill -9 <PID>  # Kill it
```

### Database not connecting
```bash
./docker.sh postgres   # Test connection
docker-compose restart postgres
```

### Need fresh start
```bash
./docker.sh clean      # Remove everything
./docker.sh start      # Start fresh
./docker.sh migrate    # Re-run migrations
```

See [DOCKER_SETUP.md](./DOCKER_SETUP.md#troubleshooting) for more help.

---

## 🎓 Learning Path

1. **Beginner** → [DOCKER_STEPS.md](./DOCKER_STEPS.md)
   - Learn Docker basics
   - Set up development environment
   - Run your first containers

2. **Intermediate** → [DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md)
   - Use helper scripts
   - Common development tasks
   - Database and cache management

3. **Advanced** → [DOCKER_SETUP.md](./DOCKER_SETUP.md)
   - Production deployment
   - Performance optimization
   - Security configuration
   - Scaling strategies

---

## 🚀 Next Steps

### Start Developing
```bash
./docker.sh start      # Start services
./docker.sh logs -f    # Watch logs
# Edit code in src/
# Changes auto-reload
```

### Deploy to Production
```bash
docker build -t authsystem:latest .
docker tag authsystem:latest your-registry/authsystem:v1.0.0
docker push your-registry/authsystem:v1.0.0
```

### Monitor Health
```bash
./docker.sh ps         # View container status
./docker.sh health     # Check health checks
./docker.sh logs app   # View application logs
```

---

## 📖 External Resources

- [Docker Docs](https://docs.docker.com)
- [Docker Compose Docs](https://docs.docker.com/compose)
- [Node.js Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Redis Docker](https://hub.docker.com/_/redis)

---

## 💡 Pro Tips

### Development
- Use volume mounts for hot reload
- Keep helper scripts handy
- Check logs frequently
- Use `docker-compose exec` for debugging

### Production
- Change default passwords
- Use environment vaults for secrets
- Enable logging aggregation
- Set up monitoring and alerts
- Use health checks
- Plan for backups

### Performance
- Use Alpine images (smaller, faster)
- Multi-stage builds (smaller final images)
- Cache dependencies
- Clean up unused images regularly

---

## ❓ Questions?

1. **Not working?** Check [DOCKER_SETUP.md](./DOCKER_SETUP.md#troubleshooting)
2. **Need commands?** Check [DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md)
3. **Want to learn?** Read [DOCKER_STEPS.md](./DOCKER_STEPS.md)
4. **Need deep dive?** See [DOCKER_SETUP.md](./DOCKER_SETUP.md)

---

## 📞 Support

### Helper Scripts
- **macOS/Linux:** `./docker.sh help`
- **Windows:** `docker.bat help`

### Docker Help
- `docker --help`
- `docker-compose --help`

### Direct Commands
```bash
docker ps              # List containers
docker logs <id>       # View logs
docker exec -it <id> sh  # Enter container
```

---

**Ready to start?** → [DOCKER_STEPS.md](./DOCKER_STEPS.md) 🚀

**Want quick reference?** → [DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md) ⚡

**Need deep dive?** → [DOCKER_SETUP.md](./DOCKER_SETUP.md) 📚
