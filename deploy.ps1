Write-Host " Production deployment starting..."

# -------------------------------
# 1. Check prerequisites
# -------------------------------
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host " Docker not installed"
    exit 1
}

# -------------------------------
# 2. Clone or update repos
# -------------------------------
if (!(Test-Path "frontend")) {
    Write-Host " Cloning frontend..."
    git clone https://github.com/Akshay-Kumar/News-Summary-frontend.git frontend
} else {
    Write-Host " Updating frontend..."
    cd frontend
    git pull
    cd ..
}

if (!(Test-Path "backend")) {
    Write-Host " Cloning backend..."
    git clone https://github.com/Akshay-Kumar/News-Summary.git backend
} else {
    Write-Host " Updating backend..."
    cd backend
    git pull
    cd ..
}

# -------------------------------
# 3. Ensure root .env exists
# -------------------------------
if (!(Test-Path ".env")) {
    Write-Host " Creating .env file..."

    @"
DOMAIN=beast-x.xyz
EMAIL=akshay.singh@dal.ca

MONGO_URI=mongodb://mongo:27017/newsdb
WORLDNEWS_API_KEYS=fe4cf09e390943b89af167224346ede7,aa327275a7c542e293886b4c105feca5,c706ca824fda48848220ae38aaf47582,71b8ddf9faba4f01b0103fd679943d63
JWT_SECRET=supersecret3302
PORT=5001
"@ | Out-File -Encoding utf8 .env

    Write-Host " Please update .env with real values before re-running"
    exit 1
}

if ($env:DOMAIN -eq "yourdomain.com") {
    Write-Host " Please update DOMAIN in .env before running"
    exit 1
}

# Load env variables
Get-Content .env | ForEach-Object {
    if ($_ -match "^\s*$") { return }   # skip empty lines
    if ($_ -match "^\s*#") { return }   # skip comments
    if ($_ -match "^(.*?)=(.*)$") {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        Set-Item -Path Env:$name -Value $value
    }
}

# -------------------------------
# 4. Configure frontend env
# -------------------------------
Write-Host " Setting frontend API URL..."
"REACT_APP_API_URL=https://api.$($env:DOMAIN)" | Out-File -Encoding utf8 frontend\.env


# -------------------------------
# 5. Checking Docker engine
# -------------------------------
Write-Host " Checking Docker engine..."

try {
    docker info | Out-Null
    Write-Host " Docker engine is running"
} catch {
    Write-Host " Docker engine not running or not reachable"
    Write-Host " Please start Docker Desktop and try again"
    exit 1
}

# -------------------------------
# 6. Start containers
# -------------------------------
Write-Host " Starting containers..."
docker compose down
docker compose up -d --build

# -------------------------------
# 7. Wait + check
# -------------------------------
Write-Host " Waiting for services..."
Start-Sleep -Seconds 10

Write-Host " Checking backend..."
try {
    Invoke-WebRequest -Uri "https://api.$($env:DOMAIN)" -UseBasicParsing | Out-Null
    Write-Host " Backend is reachable"
} catch {
    Write-Host " Backend not reachable yet (SSL may still be provisioning)"
}

Write-Host " Checking frontend..."
try {
    Invoke-WebRequest -Uri "https://news.$($env:DOMAIN)" -UseBasicParsing | Out-Null
    Write-Host " Frontend is reachable"
} catch {
    Write-Host " Frontend not reachable yet"
}

# -------------------------------
# 8. Done
# -------------------------------
Write-Host ""
Write-Host " Deployment complete!"
Write-Host " Frontend: https://news.$($env:DOMAIN)"
Write-Host " Backend:  https://api.$($env:DOMAIN)/docs"