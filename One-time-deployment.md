# 📰 One Time Deployment for Frontend and Backend News Summary
🚀 One-Click Deployment (deploy.sh)

---

## **This project includes a one-click deployment script that sets up the full stack:**
* ✅ Frontend (React + Nginx)
* ✅ Backend (Node.js API) 
* ✅ MongoDB 
* ✅ HTTPS via Traefik

---

## **What the script does**
Running deploy.sh will:
- Clone or update the frontend and backend repositories
- Create required environment configuration (.env)
- Configure frontend API URL automatically
- Build Docker images
- Start all services using Docker Compose
- Set up HTTPS (Let’s Encrypt) automatically

---

## **Prerequisites**
Before running the script, ensure:
* Docker is installed
* Docker Compose is available
* You have a domain configured:
* ✅ news.yourdomain.com  → server IP
* ✅ api.yourdomain.com   → server IP
---

## **1. Create .env file**

Create a .env file in the root directory:

```.dotenv
DOMAIN=yourdomain.com
EMAIL=your@email.com

MONGO_URI=mongodb://mongo:27017/newsdb
WORLDNEWS_API_KEYS=key1,key2,key3
JWT_SECRET=your_secret_key
PORT=5000
```
## Notes:
* Replace all placeholder values
* Do NOT commit .env to Git
* For MongoDB Atlas, replace MONGO_URI accordingly

---

## **2. Run deployment**

Make the script executable and run it:
```bash
chmod +x deploy.sh
./deploy.sh
```

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\deploy.ps1
```

## **3. Access your Application**

Frontend:
https://news.yourdomain.com

Backend API:
https://api.yourdomain.com/docs

## **Contributing**
Feel free to fork this repository and submit a pull request!

---

## **License**
MIT License
