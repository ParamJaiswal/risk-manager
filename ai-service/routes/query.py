"""
Query Route - RAG (Retrieval-Augmented Generation) endpoint.

This is the most important AI feature. It implements a RAG pipeline:
1. User asks a question about compliance
2. We search ChromaDB for relevant document chunks (retrieval)
3. We send the retrieved context + question to Groq LLM (augmented generation)
4. The LLM generates an answer grounded in the actual documents

Flow: Frontend -> Spring Boot -> Flask /query -> ChromaDB (retrieval) -> Groq API (generation) -> Response
"""

from flask import Blueprint, request, jsonify
from services.chroma_client import query_documents
from services.groq_client import generate_completion

query_bp = Blueprint('query', __name__)

@query_bp.route('/query', methods=['POST'])
def query():
    """
    POST /query
    Input:  {"question": "What is GDPR?"}
    Output: {"answer": "GDPR is a data protection regulation...", "sources": [...]}
    
    RAG Pipeline Steps:
    1. Embed the user's question using sentence-transformers
    2. Query ChromaDB to find the top-3 most relevant document chunks
    3. Build a prompt with the retrieved context
    4. Send to Groq LLM for answer generation
    5. Return the AI-generated answer with source references
    """
    try:
        data = request.get_json()
        
        # Validate input - question is required
        if not data or not data.get('question'):
            return jsonify({"error": "Question is required"}), 400
        
        question = data['question']
        
        # Step 1 & 2: Retrieve relevant document chunks from ChromaDB
        # The chroma_client handles embedding the question and finding similar chunks
        results = query_documents(question, n_results=3)
        
        # Step 3: Build the context from retrieved chunks
        # We concatenate the top relevant chunks to provide context to the LLM
        context_chunks = results.get('documents', [[]])[0]
        context = "\n\n".join(context_chunks) if context_chunks else "No relevant documents found."
        
        # Get source metadata for transparency
        sources = results.get('metadatas', [[]])[0]
        
        # Step 4: Prompt engineering with retrieved context
        # This is the "Augmented Generation" part of RAG
        # We provide the retrieved document context and ask the LLM to answer based on it
        prompt = f"""You are a compliance expert assistant. Answer the following question 
based ONLY on the provided context from compliance documents. 

If the context doesn't contain enough information to answer the question, 
say "I don't have enough information in the compliance documents to answer this question."

Context from compliance documents:
---
{context}
---

Question: {question}

Provide a clear, concise answer based on the context above. Be professional and accurate."""
        
        # Step 5: Generate answer using Groq LLM
        answer = generate_completion(prompt)
        
        # Extract source file names for reference
        source_files = list(set(
            s.get('source', 'Unknown') for s in sources if s
        ))
        
        return jsonify({
            "answer": answer,
            "sources": source_files
        })
    
    except Exception as e:
        # Fallback response if RAG pipeline fails
        print(f"Error in /query: {str(e)}")
        return jsonify({
            "answer": "I'm sorry, I couldn't process your question at this time. Please try again later.",
            "sources": []
        })
