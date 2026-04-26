# 📰 News-Summary Frontend
🚀 A React-based frontend that fetches and displays news articles from the backend API.

---

## **Features**
✅ Fetches real-time news articles from the backend API  
✅ Displays news articles in an elegant UI  
✅ Supports filtering news by category and source  
✅ Responsive design for a seamless experience across devices

---

## **Tech Stack**
- React.js
- Axios
- Bootstrap / Tailwind CSS

---

# 🐳 **Docker Deployment (Production)**

This app uses a multi-stage build and is served using Nginx.

---

## **1. Dockerfile**

```dockerfile
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod -R 755 /usr/share/nginx/html \
    && find /usr/share/nginx/html -type f -exec chmod 644 {} \; \
    && chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## **2. Nginx Config (`nginx.conf`)**

```nginx
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
```

---

## **3. Docker Compose**

```yaml
services:
  frontend:
    build: .
    container_name: news-frontend
    ports:
      - "80:80"
    restart: unless-stopped
```

---

## **4. Run Application**

```bash
docker compose up -d --build
```

---

## **5. Access Application**

Frontend:
http://localhost:8080

Test XML:
http://localhost:8080/dropdown-data.xml

---

## ⚠️ **Important Notes**

- Ensure XML files exist in:
  ```
  public/dropdown-data.xml
  public/links.xml
  ```
- Do NOT mount volumes like:
  ```
  -v /mnt/data:/usr/share/nginx/html
  ```
  → causes **403 Forbidden**

---

# 💻 **Local Development**

## **1. Clone the Repository**
```bash
git clone https://github.com/Akshay-Kumar/News-Summary-frontend.git
cd News-Summary-frontend
```

## **2. Install Dependencies**
```bash
npm install
```

## **3. Set Up Environment Variables**
Create `.env`:

```
PORT=3030
REACT_APP_API_URL=http://localhost:8000
# or in case of nginx use
# REACT_APP_API_URL=https://api.yourdomain.com
```

## **4. Run the Frontend**
```bash
npm start
```

App:
http://localhost:3030/

---

## 🔌 **API Endpoints (Backend)**

| Method | Endpoint | Description |
|--------|---------|------------|
| GET | `/news` | Fetch latest news |
| GET | `/news?category=technology` | Fetch by category |
| GET | `/news?source=bbc-news` | Fetch by source |

---

## **Contributing**
Feel free to fork this repository and submit a pull request!

---

## **License**
MIT License
