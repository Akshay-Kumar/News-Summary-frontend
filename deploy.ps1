Write-Host "Starting deployment..."

# -------------------------------
# 1. Check prerequisites
# -------------------------------
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Docker not installed"
    exit 1
}

# -------------------------------
# 2. Clone or update repos
# -------------------------------
if (!(Test-Path "frontend")) {
    Write-Host "Cloning frontend..."
    git clone https://github.com/Akshay-Kumar/News-Summary-frontend.git frontend
} else {
    Write-Host "Updating frontend..."
    cd frontend
    git pull
    cd ..
}

if (!(Test-Path "backend")) {
    Write-Host "Cloning backend..."
    git clone https://github.com/Akshay-Kumar/News-Summary.git backend
} else {
    Write-Host "Updating backend..."
    cd backend
    git pull
    cd ..
}

# -------------------------------
# 3. Ensure root .env exists
# -------------------------------
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..."

@"
FRONTEND_URL=news.beast-x.xyz
BACKEND_URL=api.beast-x.xyz
FRONTEND_PORT=3001
BACKEND_PORT=5001
MONGO_PORT=27018
"@ | Out-File -Encoding utf8 .env

    Write-Host "Please update .env with real values before re-running"
    exit 1
}

if (!(Test-Path "backend.env")) {
    Write-Host "Creating backend.env file..."

@"
MONGO_URI=mongodb://mongo:27018/newsdb
WORLDNEWS_API_KEYS=key1,key2,key3,key4
JWT_SECRET=supersecret
"@ | Out-File -Encoding utf8 backend.env

    Write-Host "Please update backend.env with real values before re-running"
    exit 1
}

# -------------------------------
# 4. Load env variables safely
# -------------------------------
Write-Host "Loading .env..."

Get-Content .env | ForEach-Object {
    if ($_ -match "^\s*$") { return }
    if ($_ -match "^\s*#") { return }
    if ($_ -match "^(.*?)=(.*)$") {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        Set-Item -Path Env:$name -Value $value
    }
}

# Defaults (fallback)
if (-not $env:FRONTEND_PORT) { $env:FRONTEND_PORT = "3001" }
if (-not $env:BACKEND_PORT) { $env:BACKEND_PORT = "5001" }

if (-not $env:FRONTEND_URL) {
    Write-Host "ERROR: FRONTEND_URL not set in .env"
    exit 1
}

if (-not $env:BACKEND_URL) {
    Write-Host "ERROR: BACKEND_URL not set in .env"
    exit 1
}

# -------------------------------
# 5. Configure frontend env
# -------------------------------
Write-Host "Setting frontend API URL..."
"REACT_APP_API_URL=$($env:BACKEND_URL)" | Out-File -Encoding utf8 frontend\.env

# -------------------------------
# 6. Check Docker engine
# -------------------------------
Write-Host "Checking Docker engine..."

try {
    docker info | Out-Null
    Write-Host "Docker engine is running"
} catch {
    Write-Host "ERROR: Docker not running. Start Docker Desktop."
    exit 1
}

# -------------------------------
# 7. Start containers
# -------------------------------
Write-Host "Starting containers..."

docker compose down -v --remove-orphans
docker compose up -d --build

# -------------------------------
# 8. Wait + health check
# -------------------------------
Write-Host "Waiting for services..."
Start-Sleep -Seconds 10

# Backend check
Write-Host "Checking backend..."
try {
    Invoke-WebRequest -Uri "$($env:BACKEND_URL)/api/worldnews" -UseBasicParsing | Out-Null
    Write-Host "Backend is reachable"
} catch {
    Write-Host "Backend not reachable yet"
}

# Frontend check
Write-Host "Checking frontend..."
try {
    Invoke-WebRequest -Uri "$($env:FRONTEND_URL)" -UseBasicParsing | Out-Null
    Write-Host "Frontend is reachable"
} catch {
    Write-Host "Frontend not reachable yet"
}

# -------------------------------
# 9. Done
# -------------------------------
Write-Host ""
Write-Host "Deployment complete!"
Write-Host "Frontend: $($env:FRONTEND_URL)"
Write-Host "Backend: $($env:BACKEND_URL)"