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

## **Contributing**
Feel free to fork this repository and submit a pull request if you have improvements!

## **License**
📝 MIT License