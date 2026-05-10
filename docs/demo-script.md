# Demo Script — Compliance Training Manager
# AI Engineer 1 Presentation Guide

## 30-Second Elevator Pitch

"I built a full-stack AI application called Compliance Training Manager. It helps
organizations manage compliance trainings using AI. My core AI contributions:
1. AI description generator using Groq LLM with prompt engineering
2. AI recommendation engine
3. RAG chatbot that answers questions from compliance documents using
   ChromaDB embeddings and retrieval-augmented generation.
Stack: React, Spring Boot, Flask, PostgreSQL."

---

## 3-Minute Demo Flow

### Scene 1: Login (15s)
- Open the app → Login with admin/admin123
- "I implemented JWT authentication — token-based, stateless"

### Scene 2: Dashboard (20s)
- Show the 3 seeded trainings
- Create a new training quickly
- "Standard CRUD with Spring Data JPA and PostgreSQL"

### Scene 3: AI Description Generator (30s)
- Switch to AI Panel tab
- Type "Data Privacy Training" → Click Generate
- "I wrote prompt engineering templates that instruct the LLM to generate
  professional compliance descriptions. Flow: React → Spring Boot → Flask → Groq API"

### Scene 4: AI Recommendations (20s)
- Type "Password Security" → Click Recommend
- "The AI returns structured recommendations. I engineered the prompt to
  output JSON and handle parsing edge cases"

### Scene 5: RAG Chatbot — THE MAIN FEATURE (45s)
- Ask: "What is GDPR?"
- Wait for response → Point out the source files
- "This is RAG — Retrieval-Augmented Generation:
  1. I loaded 3 compliance docs and split them into chunks
  2. Created embeddings using sentence-transformers (all-MiniLM-L6-v2)
  3. Stored in ChromaDB vector database
  4. When you ask a question, I embed it, search for similar chunks,
     send those as context to Groq LLM
  5. The answer is GROUNDED in real documents, not hallucinated"
- Ask: "What are the password rules?" → Show it pulls from cybersecurity doc

### Scene 6: Close (15s)
- "I built the complete AI microservice, RAG pipeline from scratch,
  integrated Groq LLM, and connected everything end-to-end. Thank you."

---

## What I Did (AI Engineer 1 Contributions)

1. RAG Pipeline      — Document loading → chunking → embedding → retrieval → generation
2. Prompt Engineering — Designed prompts for all 3 AI features
3. Groq Integration   — LLaMA 3 model via Groq API for fast inference
4. ChromaDB Setup     — Persistent vector DB with sentence-transformer embeddings
5. Flask AI Service   — 3 REST endpoints (/describe, /recommend, /query)
6. Backend Bridge     — Spring Boot → Flask communication via RestTemplate
7. Error Handling     — Fallback responses at every layer
8. Documentation      — Clear comments explaining RAG, prompts, architecture

---

## Top Interview Questions & Answers

Q: What is RAG?
A: "Retrieval-Augmented Generation. Instead of the LLM answering from memory,
   I retrieve relevant document chunks and pass them as context. This makes
   answers accurate and grounded — critical for compliance information."

Q: Why ChromaDB?
A: "Lightweight, local, no cloud costs, persistent storage, built-in
   sentence-transformer integration. Perfect for this project's scale."

Q: Why Groq?
A: "Fastest LLM inference available — sub-second responses. Free tier friendly.
   Uses open-source LLaMA 3. Easy to swap providers since I abstracted the client."

Q: What if AI service goes down?
A: "Fallback responses at every layer — Flask routes, Spring Boot controller,
   and frontend all handle errors gracefully. App never crashes."

Q: Chunking strategy?
A: "500-char sliding window with 50-char overlap. Overlap preserves context
   at boundaries. For production, I'd use semantic chunking."

Q: How does embedding work?
A: "all-MiniLM-L6-v2 converts text to 384-dimensional vectors. Similar texts
   have similar vectors. ChromaDB uses cosine similarity to find matches."
