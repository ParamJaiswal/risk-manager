# API Reference

## Authentication

### POST /api/auth/login
Login with username and password. Returns JWT token.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "role": "ADMIN"
}
```

---

## Training CRUD

All endpoints require JWT token in Authorization header: `Bearer <token>`

### GET /api/trainings
Returns all trainings.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Cyber Security Awareness",
    "description": "This training covers...",
    "status": "ACTIVE"
  }
]
```

### POST /api/trainings
Create a new training.

**Request:**
```json
{
  "title": "New Training",
  "description": "Description here",
  "status": "PENDING"
}
```

### PUT /api/trainings/{id}
Update an existing training.

### DELETE /api/trainings/{id}
Delete a training.

---

## AI Endpoints

### POST /api/ai/describe
Generate an AI description for a training.

**Request:**
```json
{ "title": "Cyber Security Training" }
```

**Response:**
```json
{ "description": "This training teaches cybersecurity best practices..." }
```

### POST /api/ai/recommend
Get AI-powered compliance recommendations.

**Request:**
```json
{ "training": "Password Security" }
```

**Response:**
```json
{
  "recommendations": [
    "Enable MFA",
    "Use strong passwords",
    "Avoid password reuse",
    "Use a password manager",
    "Change passwords regularly"
  ]
}
```

### POST /api/ai/query (RAG)
Ask questions about compliance documents using RAG.

**Request:**
```json
{ "question": "What is GDPR?" }
```

**Response:**
```json
{
  "answer": "GDPR is a comprehensive data protection regulation...",
  "sources": ["gdpr_policy.txt"]
}
```
