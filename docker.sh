#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Main script
case "${1:-help}" in
    start)
        print_header "Starting Docker Containers (Development)"
        docker-compose up -d
        print_success "Containers started"
        echo ""
        print_info "Services starting up... waiting 15 seconds"
        sleep 15
        docker-compose ps
        echo ""
        print_info "To run migrations: docker-compose exec app npm run db:migrate"
        print_info "To view logs: docker-compose logs -f"
        print_info "API available at: http://localhost:3000"
        ;;

    stop)
        print_header "Stopping Docker Containers"
        docker-compose stop
        print_success "Containers stopped"
        ;;

    down)
        print_header "Stopping and Removing Containers"
        docker-compose down
        print_success "Containers removed"
        ;;

    logs)
        print_header "Docker Logs"
        docker-compose logs -f ${2:-}
        ;;

    migrate)
        print_header "Running Database Migrations"
        docker-compose exec app npm run db:migrate
        print_success "Migrations complete"
        ;;

    build)
        print_header "Building Docker Image"
        docker-compose build
        print_success "Build complete"
        ;;

    rebuild)
        print_header "Rebuilding and Starting"
        docker-compose down
        docker-compose build
        docker-compose up -d
        sleep 15
        docker-compose ps
        print_success "Rebuild complete"
        ;;

    prod-start)
        print_header "Starting Production Stack"
        docker-compose -f docker-compose.prod.yml up -d
        print_success "Production containers started"
        docker-compose -f docker-compose.prod.yml ps
        ;;

    prod-stop)
        print_header "Stopping Production Stack"
        docker-compose -f docker-compose.prod.yml stop
        print_success "Production containers stopped"
        ;;

    prod-logs)
        print_header "Production Logs"
        docker-compose -f docker-compose.prod.yml logs -f ${2:-}
        ;;

    ps)
        print_header "Running Containers"
        docker-compose ps
        ;;

    shell)
        print_header "Entering App Container Shell"
        docker-compose exec app sh
        ;;

    postgres)
        print_header "Connecting to PostgreSQL"
        docker-compose exec postgres psql -U authuser -d authsystem
        ;;

    redis)
        print_header "Connecting to Redis CLI"
        docker-compose exec redis redis-cli
        ;;

    clean)
        print_header "Cleaning Up Docker"
        read -p "This will remove containers and volumes. Continue? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v
            print_success "Cleanup complete"
        else
            print_info "Cleanup cancelled"
        fi
        ;;

    health)
        print_header "Container Health Status"
        docker-compose ps
        echo ""
        print_info "Testing connectivity..."
        docker-compose exec app npm run dev &>/dev/null && print_success "App container is healthy" || print_error "App container issue"
        docker-compose exec postgres pg_isready -U authuser &>/dev/null && print_success "PostgreSQL is healthy" || print_error "PostgreSQL issue"
        docker-compose exec redis redis-cli ping &>/dev/null && print_success "Redis is healthy" || print_error "Redis issue"
        ;;

    help|*)
        print_header "Auth System Docker Helper"
        echo ""
        echo "Usage: ./docker.sh [command]"
        echo ""
        echo "Commands:"
        echo "  start          - Start containers in background"
        echo "  stop           - Stop all containers"
        echo "  down           - Stop and remove containers"
        echo "  logs [service] - View logs (e.g., logs app, logs postgres)"
        echo "  migrate        - Run database migrations"
        echo "  build          - Build Docker image"
        echo "  rebuild        - Rebuild image and restart containers"
        echo "  ps             - Show running containers"
        echo "  shell          - Enter app container shell"
        echo "  postgres       - Connect to PostgreSQL"
        echo "  redis          - Connect to Redis CLI"
        echo "  clean          - Remove containers and volumes"
        echo "  health         - Check container health status"
        echo ""
        echo "Production Commands:"
        echo "  prod-start     - Start production stack"
        echo "  prod-stop      - Stop production stack"
        echo "  prod-logs      - View production logs"
        echo ""
        echo "Examples:"
        echo "  ./docker.sh start"
        echo "  ./docker.sh logs app"
        echo "  ./docker.sh shell"
        echo "  ./docker.sh migrate"
        ;;
esac
