"""
Compliance Training Manager - AI Service
Flask microservice that provides AI-powered features:
1. Generate training descriptions using Groq LLM
2. Generate compliance recommendations using Groq LLM
3. Answer questions from compliance documents using RAG (Retrieval-Augmented Generation)
"""

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Import route blueprints
from routes.describe import describe_bp
from routes.recommend import recommend_bp
from routes.query import query_bp

# Import ChromaDB client to initialize document embeddings on startup
from services.chroma_client import initialize_documents

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Enable CORS so Spring Boot backend can call this service
    CORS(app)
    
    # Register route blueprints
    # Each blueprint handles a specific AI feature
    app.register_blueprint(describe_bp)    # POST /describe - Generate descriptions
    app.register_blueprint(recommend_bp)   # POST /recommend - Generate recommendations
    app.register_blueprint(query_bp)       # POST /query - RAG-based Q&A
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health():
        return {"status": "healthy", "service": "ai-service"}
    
    return app

# Create the Flask app
app = create_app()

# Initialize ChromaDB with compliance documents on startup
# This runs both in dev (python app.py) and production (gunicorn app:app)
# It loads documents, splits them into chunks, creates embeddings,
# and stores them in ChromaDB for RAG queries
print("Initializing compliance documents in ChromaDB...")
initialize_documents()
print("Documents initialized successfully!")

if __name__ == '__main__':
    # Run Flask on configured port (Render sets PORT env var)
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
