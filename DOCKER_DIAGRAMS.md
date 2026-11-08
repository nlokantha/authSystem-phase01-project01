# Docker Architecture & Flow Diagrams

## 1. Project Structure

```
authSystem-phase01-project01/
├── src/                          # Source code
│   ├── server.ts                 # Main entry point
│   ├── app.ts                    # Express app
│   ├── config/                   # Configuration
│   ├── modules/                  # Feature modules
│   ├── repositories/             # Database access
│   ├── middlewares/              # Express middlewares
│   ├── types/                    # TypeScript types
│   └── utils/                    # Utility functions
│
├── prisma/                       # Database ORM
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
│
├── dist/                         # Compiled JavaScript (created by build)
├── node_modules/                 # Dependencies (created by npm install)
│
├── Dockerfile                    # Container build config
├── .dockerignore                 # Files to exclude from build
├── docker-compose.yml            # Development environment
├── docker-compose.prod.yml       # Production environment
├── docker.sh                     # Helper script (macOS/Linux)
├── docker.bat                    # Helper script (Windows)
│
├── .env                          # Environment variables (local)
├── .env.example                  # Environment template (shared)
│
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript config
│
├── DOCKER.md                     # This file - index
├── DOCKER_STEPS.md               # Step-by-step guide
├── DOCKER_QUICKSTART.md          # Quick reference
└── DOCKER_SETUP.md               # Comprehensive guide
```

---

## 2. Container Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Docker Host Machine                      │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Docker Network: authsystem-network      │   │
│  │                                                    │   │
│  │  ┌──────────────┐  ┌──────────────────────────┐  │   │
│  │  │ Node.js      │  │ PostgreSQL Database      │  │   │
│  │  │ Container    │  │ Container                │  │   │
│  │  │              │  │                          │  │   │
│  │  │ Port: 3000   │  │ Port: 5432               │  │   │
│  │  │ Image:       │  │ Image:                   │  │   │
│  │  │ node:22      │  │ postgres:16-alpine       │  │   │
│  │  │              │  │                          │  │   │
│  │  │ Processes:   │  │ postgres service         │  │   │
│  │  │ - Express    │  │ - Schema init            │  │   │
│  │  │ - API routes │  │ - Connection pool        │  │   │
│  │  └──────┬───────┘  └──────────┬───────────────┘  │   │
│  │         │                     │                   │   │
│  │         │    Queries          │                   │   │
│  │         └────────────────────►│                   │   │
│  │                                │                   │   │
│  │         ◄────────────────────┬─┘                   │   │
│  │         │   Data Rows         │                   │   │
│  │         │                                         │   │
│  │  ┌──────▼─────────┐                              │   │
│  │  │ Redis Cache    │                              │   │
│  │  │ Container      │                              │   │
│  │  │                │                              │   │
│  │  │ Port: 6379     │                              │   │
│  │  │ Image:         │                              │   │
│  │  │ redis:7-alpine │                              │   │
│  │  │                │                              │   │
│  │  │ - Session      │                              │   │
│  │  │ - Cache store  │                              │   │
│  │  │ - Pub/Sub      │                              │   │
│  │  └────────────────┘                              │   │
│  │                                                    │   │
│  │  ┌────────────────────────────────────────────┐  │   │
│  │  │ Volumes (Persistent Storage)                │  │   │
│  │  │                                              │  │   │
│  │  │ - postgres_data: Database files             │  │   │
│  │  │ - redis_data: Cache persistence             │  │   │
│  │  │ - src/: Application source (mount)          │  │   │
│  │  └────────────────────────────────────────────┘  │   │
│  │                                                    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │  External Access                                  │   │
│  │  - localhost:3000 → App container               │   │
│  │  - localhost:5432 → PostgreSQL container        │   │
│  │  - localhost:6379 → Redis container             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Docker Build Flow

```
┌─────────────────────────────────────────────────────────┐
│                   Dockerfile                             │
│                                                           │
│  STAGE 1: Builder                                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │ FROM node:22-alpine                              │   │
│  │                                                    │   │
│  │ WORKDIR /app                                     │   │
│  │                                                    │   │
│  │ COPY package*.json ./     ◄─── src/package.json  │   │
│  │ RUN npm ci                    (install deps)     │   │
│  │                                                    │   │
│  │ COPY src ./src            ◄─── src/              │   │
│  │ RUN npm run build              (TypeScript →     │   │
│  │                                  JavaScript)     │   │
│  │                                                    │   │
│  │ OUTPUT: builder image with:                      │   │
│  │ - node_modules/                                  │   │
│  │ - dist/ (compiled code)                          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  STAGE 2: Production                                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │ FROM node:22-alpine                              │   │
│  │ (Fresh, clean base image)                        │   │
│  │                                                    │   │
│  │ WORKDIR /app                                     │   │
│  │                                                    │   │
│  │ RUN npm ci --only=production                     │   │
│  │ (Only install production deps, smaller size)     │   │
│  │                                                    │   │
│  │ COPY --from=builder /app/dist ./dist             │   │
│  │ (Copy compiled code from builder)                │   │
│  │                                                    │   │
│  │ RUN adduser nodejs                               │   │
│  │ (Add non-root user for security)                 │   │
│  │                                                    │   │
│  │ EXPOSE 3000                                      │   │
│  │ HEALTHCHECK (Setup health checks)                │   │
│  │ CMD ["node", "dist/server.js"]                   │   │
│  │ (Start application)                              │   │
│  │                                                    │   │
│  │ OUTPUT: authsystem:latest                        │   │
│  │ - Optimized for production                       │   │
│  │ - Small size (multi-stage)                       │   │
│  │ - Security hardened                              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Container Startup Sequence

```
Time │ Event
─────┼─────────────────────────────────────────────────────
  0s │ docker-compose up -d
     │ ├─ Start PostgreSQL container
     │ │  └─ Health check: pg_isready
     │
  2s │ ├─ Start Redis container
     │ │  └─ Health check: redis-cli ping
     │
  4s │ ├─ Start Node.js App container (waits for dependencies)
     │ │  ├─ Wait for PostgreSQL healthy
     │ │  ├─ Wait for Redis healthy
     │ │  └─ Start application
     │
  8s │ ├─ App connects to PostgreSQL
     │ │  └─ Prisma client initializes
     │
 12s │ ├─ App connects to Redis
     │ │  └─ Session/cache store ready
     │
 15s │ └─ All services healthy
     │    └─ API ready at localhost:3000
     │
 20s │ docker-compose exec app npm run db:migrate
     │ ├─ Read schema.prisma
     │ ├─ Check pending migrations
     │ ├─ Apply migrations to PostgreSQL
     │ └─ Database ready!
     │
 25s │ Ready for development! 🚀

```

---

## 5. Request Flow Through Containers

```
┌─────────────────────────────────────────────────────────┐
│  Client (Browser/API Client)                             │
│  http://localhost:3000/api/users                         │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP Request
                   ▼
┌─────────────────────────────────────────────────────────┐
│  Node.js Container                                        │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Express Server (port 3000)                         │  │
│  │                                                     │  │
│  │ Request → Middleware Chain                        │  │
│  │    ↓                                                │  │
│  │  1. bodyParser                                     │  │
│  │  2. Authentication middleware                      │  │
│  │  3. Request logging                                │  │
│  │    ↓                                                │  │
│  │  Route Handler                                     │  │
│  │  │                                                  │  │
│  │  ├─→ Check Redis Cache                             │  │
│  │  │   └─ Hit? → Return cached response              │  │
│  │  │                                                  │  │
│  │  └─→ Query PostgreSQL Database                     │  │
│  │      └─ Get user data via Prisma ORM              │  │
│  │                                                     │  │
│  │  Store in Redis Cache                              │  │
│  │  Send JSON Response                                │  │
│  │                                                     │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────┘
                   │ TCP/IP Network (Docker Network)
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
    ┌────────────────┐  ┌─────────────────┐
    │ PostgreSQL     │  │ Redis           │
    │ localhost:5432 │  │ localhost:6379  │
    │                │  │                 │
    │ Executes query │  │ Stores/Retrieves│
    │ Returns rows   │  │ session data    │
    └────────────────┘  └─────────────────┘
                   │                     │
        ┌──────────┴──────────┐          │
        │                     │          │
        ▼                     ▼          │
┌─────────────────────────────────────────────────────────┐
│  Response Assembly in Node.js Container                  │
│                                                           │
│  Format JSON response with:                              │
│  - User data from PostgreSQL                             │
│  - Cached auxiliary info from Redis                      │
│  - HTTP headers                                          │
│  - Status code                                           │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP Response
                   ▼
┌─────────────────────────────────────────────────────────┐
│  Client (Browser/API Client)                             │
│  Receives JSON response                                   │
│  Display data / Process response                          │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Docker Compose Command Flow

```
┌────────────────────────────────────────┐
│  docker-compose up -d                  │
└────────┬─────────────────────────────┘
         │
         ▼
    ┌─────────────────┐
    │ Read compose    │
    │ YAML file(s)    │
    │ - services:     │
    │   - postgres    │
    │   - redis       │
    │   - app         │
    │ - volumes:      │
    │ - networks:     │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │ Create Docker Network       │
    │ authsystem-network          │
    │ (Enables service discovery) │
    └────────┬────────────────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │ Create Volumes              │
    │ - postgres_data             │
    │ - redis_data                │
    └────────┬────────────────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │ Build Images (if needed)    │
    │ - authsystem:latest         │
    └────────┬────────────────────┘
             │
             ├─→ Create postgres container
             │   ├─ Run health check
             │   └─ Wait for healthy status
             │
             ├─→ Create redis container
             │   ├─ Run health check
             │   └─ Wait for healthy status
             │
             └─→ Create app container
                 ├─ Wait for dependencies
                 ├─ Connect to network
                 ├─ Mount volumes
                 ├─ Set environment
                 └─ Start application
```

---

## 7. Development Workflow

```
┌─────────────────────────────────────────────────────────┐
│                  Development Cycle                        │
└─────────────────────────────────────────────────────────┘

    1. Start Services
       ├─ ./docker.sh start
       ├─ docker-compose up -d
       └─ Containers running
           │
           ▼
    2. Edit Code
       ├─ src/app.ts
       ├─ src/modules/users.ts
       └─ src/routes/api.ts
           │
           ▼ (File saved)
           │
    3. Auto-Compile (tsc --watch)
       ├─ TypeScript compiler watches src/
       ├─ Detects changes
       ├─ Compiles to dist/
       └─ Hot reload enabled
           │
           ▼
    4. Application Restarts
       ├─ Process manager detects changes
       ├─ Restarts application
       └─ Ready for next request
           │
           ▼
    5. Test Changes
       ├─ Refresh browser
       ├─ Curl API endpoint
       ├─ Check logs
       └─ Verify behavior
           │
           ▼
    6. Repeat
       └─ Go back to step 2
           │
           ▼
    7. When Done
       ├─ ./docker.sh stop
       └─ Containers stopped, data persisted
```

---

## 8. File Mounting During Development

```
Host Machine (Your Computer)        Docker Container
────────────────────────────────    ──────────────────

authSystem-phase01-project01/       /app/
├── src/                       ◄────►├── src/
│   ├── app.ts                        │   ├── app.ts
│   ├── server.ts                     │   ├── server.ts
│   └── ...                           │   └── ...
│
├── package.json          ◄───────────├── package.json
├── dist/                 ◄───────────├── dist/ (generated)
│                                     │
└── node_modules/         ◄───────────└── node_modules/


  ✏️  Edit src/ files on host
         │
         ▼
  Files sync to container
  (mount in docker-compose.yml)
         │
         ▼
  TypeScript compiler (in container)
  watches for changes
         │
         ▼
  Compiles to dist/
         │
         ▼
  Application reloads
         │
         ▼
  🚀 Instant feedback (no rebuild!)
```

---

## 9. Production vs Development

```
┌──────────────────────┬──────────────────────┐
│     Development      │     Production       │
├──────────────────────┼──────────────────────┤
│ docker-compose.yml   │ docker-compose.      │
│                      │ prod.yml             │
├──────────────────────┼──────────────────────┤
│ NODE_ENV=            │ NODE_ENV=            │
│ development          │ production           │
├──────────────────────┼──────────────────────┤
│ Hot reload enabled   │ Hot reload disabled  │
│ (watch mode)         │ (faster startup)     │
├──────────────────────┼──────────────────────┤
│ Volumes mounted      │ No volumes           │
│ for src/             │ (only data volumes)  │
├──────────────────────┼──────────────────────┤
│ restart: "no"        │ restart:             │
│                      │ "unless-stopped"     │
├──────────────────────┼──────────────────────┤
│ Detailed logs        │ Production logging   │
│                      │ (configured)         │
├──────────────────────┼──────────────────────┤
│ Health checks        │ Stricter health      │
│ relaxed              │ checks               │
├──────────────────────┼──────────────────────┤
│ env: development     │ env: production      │
│ (loose security)     │ (strict security)    │
├──────────────────────┼──────────────────────┤
│ Easy debugging       │ Optimized for        │
│                      │ performance          │
└──────────────────────┴──────────────────────┘
```

---

## 10. Troubleshooting Decision Tree

```
Services not starting?
│
├─ Check Docker
│  ├─ docker ps
│  └─ docker --version
│
├─ View Logs
│  ├─ docker-compose logs app
│  ├─ docker-compose logs postgres
│  └─ docker-compose logs redis
│
├─ Is it port conflict?
│  ├─ lsof -i :3000
│  ├─ lsof -i :5432
│  └─ lsof -i :6379
│
├─ Is it disk space?
│  └─ docker system prune -a
│
└─ Is it resource limitation?
   └─ Increase Docker memory in settings

Cannot connect to database?
│
├─ Is PostgreSQL running?
│  ├─ docker-compose ps
│  └─ docker-compose logs postgres
│
├─ Is DATABASE_URL correct?
│  └─ Check .env file
│
├─ Wait for startup
│  └─ sleep 10 && docker-compose exec app npm run db:migrate
│
└─ Test connection
   └─ docker-compose exec app psql -h postgres -U authuser

Application crashes?
│
├─ Check logs
│  └─ docker-compose logs -f app
│
├─ Check dependency
│  ├─ Is PostgreSQL up?
│  ├─ Is Redis up?
│  └─ docker-compose ps
│
├─ Check code
│  └─ ./docker.sh shell (enter and inspect)
│
└─ Rebuild
   ├─ docker-compose build
   └─ docker-compose up -d
```

---

This visual documentation helps you understand the entire Docker architecture and workflow for your Auth System project. Refer back to these diagrams when needed!
