# RAG (Retrieval-Augmented Generation) - Explained Simply

## What is RAG?

RAG is a technique that makes AI answers more accurate by giving the AI relevant documents to read before answering.

Think of it like this: Instead of asking someone a question from memory, you give them the relevant textbook pages first, then ask the question.

## How RAG Works in This Project

```
User asks: "What is GDPR?"
         │
         ▼
┌─────────────────────────────┐
│ Step 1: EMBED the question  │
│ Convert text → numbers      │
│ using sentence-transformers │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Step 2: SEARCH ChromaDB     │
│ Find document chunks with   │
│ similar meaning (vectors)   │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Step 3: BUILD PROMPT        │
│ Combine retrieved chunks    │
│ + original question         │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Step 4: SEND TO GROQ LLM   │
│ LLM reads context and       │
│ generates accurate answer   │
└─────────────────────────────┘
         │
         ▼
    AI Answer with sources
```

## Key Components

### 1. Embeddings (sentence-transformers)
- Converts text into numerical vectors (arrays of numbers)
- Similar texts have similar vectors
- Model: `all-MiniLM-L6-v2` (lightweight, fast)

### 2. Vector Database (ChromaDB)
- Stores document chunks as vectors
- Performs fast similarity search
- Persistent storage survives restarts

### 3. LLM (Groq + LLaMA)
- Generates human-like answers
- Receives retrieved context + question
- Groq provides fast inference

## Interview Explanation

> "I built a RAG pipeline that lets users ask questions about compliance documents. 
> First, I split documents into chunks and created embeddings using sentence-transformers. 
> These embeddings are stored in ChromaDB, a vector database. 
> When a user asks a question, I embed their question, search ChromaDB for the most relevant chunks, 
> then send those chunks as context to the Groq LLM to generate an accurate, grounded answer."
