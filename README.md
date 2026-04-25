### **News-Summary Frontend**
🚀 A Node.js-powered frontend that fetches and displays news articles from a news API.

## **Features**
✅ Fetches real-time news articles from the backend API  
✅ Displays news articles in an elegant UI  
✅ Supports filtering news by category and source  
✅ Responsive design for a seamless experience across devices

## **Tech Stack**
- **HTML, CSS, JavaScript**
- **Node.js**
- **React.js**
- **Axios** (for API calls)
- **Bootstrap / Tailwind CSS** (for styling)

## **Getting Started**

### **1. Clone the Repository**
```bash
git clone https://github.com/Akshay-Kumar/News-Summary-frontend.git
cd News-Summary-frontend
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up Environment Variables**
Create a `.env` file in the root directory and add:
```plaintext
PORT=3030
REACT_APP_API_URL=<backend-api-url>
```
Ensure the backend service is running at the specified URL.

### **4. Run the Frontend**
```bash
npm start
```
The application will be available at `http://localhost:3030/`.

### **5. API Endpoints (From Backend)**
| Method | Endpoint | Description |
|--------|---------|------------|
| GET    | `/news` | Fetch latest news articles |
| GET    | `/news?category=technology` | Fetch news by category |
| GET    | `/news?source=bbc-news` | Fetch news from a specific source |


# 🐳 **Docker Deployment (Production)**

This app uses a multi-stage build and is served using Nginx.

---

## **1. Create Dockerfile**

```dockerfile
# Stage 1: Build React app
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fix permissions (important for TrueNAS / Docker)
RUN chmod -R 755 /usr/share/nginx/html \
    && find /usr/share/nginx/html -type f -exec chmod 644 {} \; \
    && chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


## **2. Create Nginx Config (nginx.conf)**
server {
    listen 80;

    location / {
        root /usr/share/nginx/html;
        index index.html;

        # Fix React routing (prevents 404 on refresh/logout)
        try_files $uri /index.html;
    }

    # Allow XML files (fixes 403 issue)
    location ~* \.xml$ {
        allow all;
        default_type application/xml;
    }
}

## **3. Create docker-compose.yml**


services:
  frontend:
    build: .
    container_name: news-frontend
    ports:
      - "8080:80"
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    image: news-backend:latest   # replace with your backend image
    container_name: news-backend
    ports:
      - "8000:8000"
    environment:
      - MONGO_URL=mongodb://mongo:27017/newsdb
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6
    container_name: news-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
  

## **4. Run Application**
docker compose up -d --build

## **5. Access Application**
Frontend:
http://localhost:8080

Backend:
http://localhost:8000/docs

Test XML:
http://localhost:8080/dropdown-data.xml


## **6. Stop Application**
docker compose down


## **Contributing**
Feel free to fork this repository and submit a pull request if you have improvements!

## **License**
📝 MIT License
