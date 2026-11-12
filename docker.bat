@echo off
REM Auth System Docker Helper Script for Windows

setlocal enabledelayedexpansion

set command=%1
if "!command!"=="" set command=help

goto !command!

:start
echo.
echo Starting Docker Containers (Development)...
docker-compose up -d --build --wait
if errorlevel 1 exit /b %errorlevel%
echo.
docker-compose ps
if errorlevel 1 exit /b %errorlevel%
echo Containers started and healthy.
echo.
echo To run migrations: docker.bat migrate
echo To view logs: docker-compose logs -f
echo API available at: http://localhost:3000
goto end

:stop
echo.
echo Stopping Docker Containers...
docker-compose stop
if errorlevel 1 exit /b %errorlevel%
echo Containers stopped.
goto end

:down
echo.
echo Stopping and Removing Containers...
docker-compose down
if errorlevel 1 exit /b %errorlevel%
echo Containers removed.
goto end

:logs
if "!2!"=="" (
    docker-compose logs -f
) else (
    docker-compose logs -f !2!
)
goto end

:migrate
echo.
echo Running Database Migrations...
docker-compose exec -T app npm run db:deploy
if errorlevel 1 exit /b %errorlevel%
echo Migrations complete.
goto end

:build
echo.
echo Building Docker Image...
docker-compose build
if errorlevel 1 exit /b %errorlevel%
echo Build complete.
goto end

:rebuild
echo.
echo Rebuilding and Starting...
docker-compose down
if errorlevel 1 exit /b %errorlevel%
docker-compose build
if errorlevel 1 exit /b %errorlevel%
docker-compose up -d --wait
if errorlevel 1 exit /b %errorlevel%
docker-compose ps
if errorlevel 1 exit /b %errorlevel%
echo Rebuild complete.
goto end

:prod-start
echo.
echo Starting Production Stack...
docker-compose -f docker-compose.prod.yml up -d --build --wait
if errorlevel 1 exit /b %errorlevel%
echo Production containers started.
docker-compose -f docker-compose.prod.yml ps
goto end

:prod-stop
echo.
echo Stopping Production Stack...
docker-compose -f docker-compose.prod.yml stop
if errorlevel 1 exit /b %errorlevel%
echo Production containers stopped.
goto end

:prod-logs
if "!2!"=="" (
    docker-compose -f docker-compose.prod.yml logs -f
) else (
    docker-compose -f docker-compose.prod.yml logs -f !2!
)
goto end

:ps
echo.
echo Running Containers:
docker-compose ps
goto end

:shell
echo.
echo Entering App Container Shell...
docker-compose exec app sh
goto end

:postgres
echo.
echo Connecting to PostgreSQL...
docker-compose exec postgres psql -U authuser -d authsystem
goto end

:redis
echo.
echo Connecting to Redis CLI...
docker-compose exec redis redis-cli
goto end

:clean
echo.
echo WARNING: This will remove all containers and volumes!
set /p response="Continue? (y/n): "
if /i "!response!"=="y" (
    docker-compose down -v
    if errorlevel 1 exit /b 1
    echo Cleanup complete.
) else (
    echo Cleanup cancelled.
)
goto end

:help
echo.
echo ====== Auth System Docker Helper ======
echo.
echo Usage: docker.bat [command]
echo.
echo Commands:
echo   start          - Start containers in background
echo   stop           - Stop all containers
echo   down           - Stop and remove containers
echo   logs [service] - View logs (e.g., logs app, logs postgres)
echo   migrate        - Run database migrations
echo   build          - Build Docker image
echo   rebuild        - Rebuild image and restart containers
echo   ps             - Show running containers
echo   shell          - Enter app container shell
echo   postgres       - Connect to PostgreSQL
echo   redis          - Connect to Redis CLI
echo   clean          - Remove containers and volumes
echo.
echo Production Commands:
echo   prod-start     - Start production stack
echo   prod-stop      - Stop production stack
echo   prod-logs      - View production logs
echo.
echo Examples:
echo   docker.bat start
echo   docker.bat logs app
echo   docker.bat shell
echo   docker.bat migrate
goto end

:end
endlocal
