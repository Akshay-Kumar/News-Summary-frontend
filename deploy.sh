#!/bin/bash
set -e

echo "🚀 Production deployment starting..."

# -------------------------------
# 1. Check prerequisites
# -------------------------------
if ! command -v docker &> /dev/null; then
  echo "❌ Docker not installed"
  exit 1
fi

# -------------------------------
# 2. Clone or update repos
# -------------------------------
if [ ! -d frontend ]; then
  echo "📦 Cloning frontend..."
  git clone https://github.com/Akshay-Kumar/News-Summary-frontend.git frontend
else
  echo "🔄 Updating frontend..."
  cd frontend && git pull && cd ..
fi

if [ ! -d backend ]; then
  echo "📦 Cloning backend..."
  git clone https://github.com/Akshay-Kumar/News-Summary.git backend
else
  echo "🔄 Updating backend..."
  cd backend && git pull && cd ..
fi

# -------------------------------
# 3. Ensure root .env exists
# -------------------------------
if [ ! -f ".env" ]; then
  echo "⚙️ Creating .env file..."

  cat <<EOF > .env
DOMAIN=yourdomain.com
EMAIL=your@email.com

MONGO_URI=mongodb://mongo:27017/newsdb
WORLDNEWS_API_KEYS=key1,key2,key3
JWT_SECRET=supersecret
PORT=5001
EOF

  echo "⚠️ Please update .env with real values before re-running"
  exit 1
fi

# Load env
export $(grep -v '^#' .env | xargs)

# -------------------------------
# 4. Configure frontend env
# -------------------------------
echo "⚙️ Setting frontend API URL..."
echo "REACT_APP_API_URL=https://api.${DOMAIN}" > frontend/.env

# -------------------------------
# 5. Fix permissions (TrueNAS safe)
# -------------------------------
chmod -R 755 frontend backend || true

# -------------------------------
# 6. Start containers
# -------------------------------
echo "🐳 Starting containers..."
docker compose down || true
docker compose up -d --build

# -------------------------------
# 7. Wait + check
# -------------------------------
echo "⏳ Waiting for services..."
sleep 10

echo "🔍 Checking backend..."
if curl -k -s https://api.${DOMAIN} > /dev/null; then
  echo "✅ Backend is reachable"
else
  echo "⚠️ Backend not reachable yet (SSL may still be provisioning)"
fi

echo "🔍 Checking frontend..."
if curl -k -s https://news.${DOMAIN} > /dev/null; then
  echo "✅ Frontend is reachable"
else
  echo "⚠️ Frontend not reachable yet"
fi

# -------------------------------
# 8. Done
# -------------------------------
echo ""
echo "🎉 Deployment complete!"
echo "🌐 Frontend: https://news.${DOMAIN}"
echo "🔧 Backend:  https://api.${DOMAIN}/docs"