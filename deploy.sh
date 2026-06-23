#!/bin/bash
set -e

echo "Deployment starting..."

# -------------------------------
# 1. Check prerequisites
# -------------------------------
if ! command -v docker &> /dev/null; then
  echo "ERROR: Docker not installed"
  exit 1
fi

# Detect compose command
if docker compose version &> /dev/null; then
  COMPOSE_CMD="docker compose"
else
  COMPOSE_CMD="docker-compose"
fi

echo "Using: $COMPOSE_CMD"

# -------------------------------
# 2. Clone or update repos
# -------------------------------
if [ ! -d frontend ]; then
  echo "Cloning frontend..."
  git clone https://github.com/Akshay-Kumar/News-Summary-frontend.git frontend
else
  echo "Updating frontend..."
  cd frontend && git pull && cd ..
fi

if [ ! -d backend ]; then
  echo "Cloning backend..."
  git clone https://github.com/Akshay-Kumar/News-Summary.git backend
else
  echo "Updating backend..."
  cd backend && git pull && cd ..
fi

# -------------------------------
# 3. Ensure root .env exists
# -------------------------------
if [ ! -f ".env" ]; then
  echo "Creating .env file..."

  cat <<EOF > .env
FRONTEND_URL=https://news.beast-x.xyz
BACKEND_URL=https://api.beast-x.xyz
FRONTEND_PORT=3001
BACKEND_PORT=5001
MONGO_PORT=27018
EOF

  echo "Please update .env before re-running"
  exit 1
fi

if [ ! -f "backend.env" ]; then
  echo "Creating backend.env file..."

  cat <<EOF > backend.env
MONGO_URI=mongodb://mongo:27017/news-summary
WORLDNEWS_API_KEYS=key1,key2,key3,key4
JWT_SECRET=secret
EOF

  echo "Please update backend.env before re-running"
  exit 1
fi

# -------------------------------
# 4. Load env safely
# -------------------------------
echo "Loading .env..."

sed -i '1s/^\xEF\xBB\xBF//' .env || true

set -a
source .env
set +a

# Validate FRONTEND_URL
if [ -z "$FRONTEND_URL" ]; then
  echo "ERROR: FRONTEND_URL not set in .env"
  exit 1
fi

# Validate BACKEND_URL
if [ -z "$BACKEND_URL" ]; then
  echo "ERROR: BACKEND_URL not set in .env"
  exit 1
fi

# -------------------------------
# 5. Configure frontend env
# -------------------------------
echo "Setting frontend API URL..."
printf "REACT_APP_API_URL=%s" "$BACKEND_URL" > frontend/.env

# -------------------------------
# 6. Start containers
# -------------------------------
echo "Starting containers..."
# $COMPOSE_CMD down --remove-orphans || true
# $COMPOSE_CMD up -d --build
$COMPOSE_CMD pull
$COMPOSE_CMD up -d --build

# -------------------------------
# 7. Wait + health check
# -------------------------------
echo "Waiting for backend..."
for i in {1..10}; do
  if curl -k -s ${BACKEND_URL} > /dev/null; then
    echo "Backend is reachable"
    break
  fi
  echo "Waiting... ($i/10)"
  sleep 3
done

echo "Checking backend..."
if curl -k -s ${BACKEND_URL}/api/worldnews > /dev/null; then
  echo "Backend is reachable"
else
  echo "Backend not reachable yet"
fi

echo "Checking frontend..."
if curl -k -s --max-time 5 ${FRONTEND_URL} > /dev/null; then
  echo "Frontend is reachable"
else
  echo "Frontend not reachable yet"
fi

# -------------------------------
# 8. Done
# -------------------------------
echo ""
echo "Deployment complete!"
echo "Frontend: ${FRONTEND_URL}"
echo "Backend:  ${BACKEND_URL}"