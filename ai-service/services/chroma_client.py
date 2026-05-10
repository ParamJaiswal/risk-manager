"""
ChromaDB Client - Handles document storage and retrieval for RAG.

RAG (Retrieval-Augmented Generation) Pipeline Overview:
1. LOAD: Read compliance documents from the documents/ folder
2. CHUNK: Split documents into smaller pieces (~500 characters each)
3. EMBED: Convert chunks into numerical vectors (embeddings) using sentence-transformers
4. STORE: Save embeddings in ChromaDB (a vector database)
5. QUERY: When a user asks a question, find the most similar document chunks
6. The retrieved chunks are then sent to Groq LLM as context for answer generation

ChromaDB is a lightweight vector database that stores embeddings and supports
similarity search. sentence-transformers converts text to embeddings.
"""

import os
import chromadb
from chromadb.utils import embedding_functions

# Directory containing compliance documents
DOCUMENTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "documents")

# ChromaDB persistent storage directory
CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_data")

# Collection name in ChromaDB (like a table in a regular database)
COLLECTION_NAME = "compliance_docs"

# Initialize the embedding function using sentence-transformers
# all-MiniLM-L6-v2 is a lightweight model that converts text to 384-dimensional vectors
# These vectors capture the semantic meaning of the text
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# Initialize ChromaDB client with persistent storage
# This means embeddings survive server restarts
chroma_client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)


def chunk_text(text, chunk_size=500, overlap=50):
    """
    Split a document into smaller overlapping chunks.
    
    Why chunking?
    - LLMs have token limits, so we can't send entire documents
    - Smaller chunks allow more precise retrieval
    - Overlap ensures we don't lose context at chunk boundaries
    
    Args:
        text (str): The full document text
        chunk_size (int): Target size of each chunk in characters
        overlap (int): Number of overlapping characters between chunks
    
    Returns:
        list[str]: List of text chunks
    """
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        # Only add non-empty chunks
        if chunk.strip():
            chunks.append(chunk.strip())
        # Move to next chunk with overlap
        start = end - overlap
    return chunks


def initialize_documents():
    """
    Load compliance documents, create embeddings, and store in ChromaDB.
    
    This function runs once at startup and:
    1. Reads all .txt files from the documents/ directory
    2. Splits each document into chunks
    3. Creates embeddings using sentence-transformers
    4. Stores everything in ChromaDB for later retrieval
    """
    # Get or create the ChromaDB collection
    # If documents are already loaded (persistent storage), we skip re-loading
    collection = chroma_client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=sentence_transformer_ef
    )
    
    # Check if documents are already loaded
    if collection.count() > 0:
        print(f"ChromaDB already has {collection.count()} chunks loaded. Skipping initialization.")
        return
    
    # Load and process each document
    documents = []
    metadatas = []
    ids = []
    chunk_id = 0
    
    for filename in os.listdir(DOCUMENTS_DIR):
        if filename.endswith('.txt'):
            filepath = os.path.join(DOCUMENTS_DIR, filename)
            print(f"Loading document: {filename}")
            
            with open(filepath, 'r', encoding='utf-8') as f:
                text = f.read()
            
            # Split document into chunks
            chunks = chunk_text(text)
            print(f"  -> Created {len(chunks)} chunks")
            
            for chunk in chunks:
                documents.append(chunk)
                # Store metadata about which document this chunk came from
                metadatas.append({"source": filename, "chunk_id": chunk_id})
                ids.append(f"chunk_{chunk_id}")
                chunk_id += 1
    
    if documents:
        # Add all chunks to ChromaDB
        # ChromaDB automatically creates embeddings using our sentence_transformer_ef
        collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        print(f"Successfully loaded {len(documents)} chunks into ChromaDB!")
    else:
        print("No documents found in the documents/ directory.")


def query_documents(question, n_results=3):
    """
    Search ChromaDB for document chunks relevant to the user's question.
    
    How similarity search works:
    1. The question is converted to an embedding vector using the same model
    2. ChromaDB compares this vector against all stored chunk vectors
    3. It returns the n_results most similar chunks (using cosine similarity)
    
    Args:
        question (str): The user's question
        n_results (int): Number of relevant chunks to retrieve
    
    Returns:
        dict: ChromaDB results containing documents, metadatas, and distances
    """
    collection = chroma_client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=sentence_transformer_ef
    )
    
    # Query ChromaDB - it automatically embeds the question and finds similar chunks
    results = collection.query(
        query_texts=[question],
        n_results=n_results
    )
    
    return results
