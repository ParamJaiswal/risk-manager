# 🛡️ Compliance Training Manager

AI-powered full-stack application for managing compliance trainings with AI-generated descriptions, recommendations, and a RAG-based chatbot.

## 🏗️ Architecture

```
React Frontend (5173) → Spring Boot Backend (8080) → Flask AI Service (5000) → Groq API
                              ↓                            ↓
                         PostgreSQL                    ChromaDB
```

## 📁 Project Structure

```
project/
├── backend/          # Java 17 + Spring Boot 3 (REST APIs, JWT Auth)
├── ai-service/       # Python Flask (Groq AI, ChromaDB RAG)
├── frontend/         # React 18 + Vite + Tailwind CSS
├── docs/             # API reference, RAG explanation
├── docker-compose.yml
└── README.md
```

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 JWT Auth | Simple login with hardcoded admin user |
| 📋 Training CRUD | Create, Read, Update, Delete compliance trainings |
| 🤖 AI Descriptions | Generate training descriptions using Groq LLM |
| 💡 AI Recommendations | Get compliance recommendations from AI |
| 📚 RAG Chatbot | Ask questions from compliance documents |

## 🚀 Quick Start

### Prerequisites
- Java 17 + Maven
- Python 3.9+
- Node.js 18+
- PostgreSQL 15+
- Groq API Key (free at https://console.groq.com)

### 1. Database Setup
```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE ctm_db;"
```

### 2. Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
```

### 3. AI Service (Flask)
```bash
cd ai-service
pip install -r requirements.txt

# Add your Groq API key to .env file
# GROQ_API_KEY=your-key-here

python app.py
# Runs on http://localhost:5000
```

### 4. Frontend (React)
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 5. Login
- Username: `admin`
- Password: `admin123`

## 🐳 Docker Setup (Alternative)
```bash
# Set your Groq API key
export GROQ_API_KEY=your-key-here

# Start all services
docker-compose up --build
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/trainings` | List all trainings |
| POST | `/api/trainings` | Create training |
| PUT | `/api/trainings/{id}` | Update training |
| DELETE | `/api/trainings/{id}` | Delete training |
| POST | `/api/ai/describe` | Generate AI description |
| POST | `/api/ai/recommend` | Get AI recommendations |
| POST | `/api/ai/query` | RAG document Q&A |

## 🧠 How RAG Works

1. **Load** compliance documents (GDPR, Cybersecurity, Employee Conduct)
2. **Chunk** documents into ~500 character pieces
3. **Embed** chunks using sentence-transformers (all-MiniLM-L6-v2)
4. **Store** embeddings in ChromaDB vector database
5. **Query** - When user asks a question:
   - Embed the question
   - Search ChromaDB for similar chunks
   - Send chunks + question to Groq LLM
   - Return AI-generated answer with sources

## 🎯 Demo Flow

```
1. Login (admin/admin123)
2. View Dashboard with seeded trainings
3. Create a new training
4. Switch to AI Panel
5. Generate Description → enter "Data Privacy Training"
6. Get Recommendations → enter "Password Security"
7. Ask AI Question → "What is GDPR?"
8. Edit/Delete a training
9. Logout
```

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Axios
- **Backend:** Java 17, Spring Boot 3, Spring Security, JPA
- **AI Service:** Python, Flask, Groq API, ChromaDB, sentence-transformers
- **Database:** PostgreSQL
- **Auth:** JWT (JSON Web Tokens)

## 📄 License

MIT
