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
* ✅ news.yourdomain.com  → server Frontend IP
* ✅ api.yourdomain.com   → server Backend IP
---

## **1. Create .env file**

Create a .env file in the root directory:

```.dotenv
FRONTEND_URL=**URL**
BACKEND_URL=**URL**
FRONTEND_PORT=3001
BACKEND_PORT=5001
MONGO_PORT=27017
```
## Notes:
* Replace all placeholder values
* Do NOT commit .env to Git
* For MongoDB Atlas, replace MONGO_PORT accordingly

---

## **2. Create backend.env file**

Create a .env file in the root directory:

```.dotenv
MONGO_URI=mongodb://mongo:27017/news-summary
WORLDNEWS_API_KEYS=key1,key2,key3,key4
JWT_SECRET=**********
```
## Notes:
* Replace all placeholder values
* Do NOT commit backend.env to Git
* For MongoDB Atlas, replace MONGO_URI accordingly

---

## **3. Run deployment**

Make the script executable and run it:
```bash
chmod +x deploy.sh
./deploy.sh
```

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\deploy.ps1
```

## **4. Access your Application**

Frontend:
https://news.yourdomain.com

Backend API:
https://api.yourdomain.com/docs

## **Contributing**
Feel free to fork this repository and submit a pull request!

---

## **License**
MIT License
