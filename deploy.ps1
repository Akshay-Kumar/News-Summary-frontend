Write-Host "🚀 Production deployment starting..."

# -------------------------------
# 1. Check prerequisites
# -------------------------------
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker not installed"
    exit 1
}

# -------------------------------
# 2. Clone or update repos
# -------------------------------
if (!(Test-Path "frontend")) {
    Write-Host "📦 Cloning frontend..."
    git clone https://github.com/Akshay-Kumar/News-Summary-frontend.git frontend
} else {
    Write-Host "🔄 Updating frontend..."
    cd frontend
    git pull
    cd ..
}

if (!(Test-Path "backend")) {
    Write-Host "📦 Cloning backend..."
    git clone https://github.com/Akshay-Kumar/News-Summary.git backend
} else {
    Write-Host "🔄 Updating backend..."
    cd backend
    git pull
    cd ..
}

# -------------------------------
# 3. Ensure root .env exists
# -------------------------------
if (!(Test-Path ".env")) {
    Write-Host "⚙️ Creating .env file..."

@"
DOMAIN=yourdomain.com
EMAIL=your@email.com

MONGO_URI=mongodb://mongo:27017/newsdb
WORLDNEWS_API_KEYS=key1,key2,key3
JWT_SECRET=supersecret
PORT=5000
"@ | Out-File -Encoding utf8 .env

    Write-Host "⚠️ Please update .env with real values before re-running"
    exit 1
}

# Load env variables
Get-Content .env | ForEach-Object {
    if ($_ -match "^(.*?)=(.*)$") {
        $name = $matches[1]
        $value = $matches[2]
        Set-Item -Path Env:$name -Value $value
    }
}

# -------------------------------
# 4. Configure frontend env
# -------------------------------
Write-Host "⚙️ Setting frontend API URL..."
"REACT_APP_API_URL=https://api.$($env:DOMAIN)" | Out-File -Encoding utf8 frontend\.env

# -------------------------------
# 5. Start containers
# -------------------------------
Write-Host "🐳 Starting containers..."
docker compose down
docker compose up -d --build

# -------------------------------
# 6. Wait + check
# -------------------------------
Write-Host "⏳ Waiting for services..."
Start-Sleep -Seconds 10

Write-Host "🔍 Checking backend..."
try {
    Invoke-WebRequest -Uri "https://api.$($env:DOMAIN)" -UseBasicParsing | Out-Null
    Write-Host "✅ Backend is reachable"
} catch {
    Write-Host "⚠️ Backend not reachable yet (SSL may still be provisioning)"
}

Write-Host "🔍 Checking frontend..."
try {
    Invoke-WebRequest -Uri "https://news.$($env:DOMAIN)" -UseBasicParsing | Out-Null
    Write-Host "✅ Frontend is reachable"
} catch {
    Write-Host "⚠️ Frontend not reachable yet"
}

# -------------------------------
# 7. Done
# -------------------------------
Write-Host ""
Write-Host "🎉 Deployment complete!"
Write-Host "🌐 Frontend: https://news.$($env:DOMAIN)"
Write-Host "🔧 Backend:  https://api.$($env:DOMAIN)/docs"