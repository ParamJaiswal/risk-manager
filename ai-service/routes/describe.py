"""
Describe Route - Generates professional compliance training descriptions using Groq LLM.

Flow: Frontend -> Spring Boot -> Flask /describe -> Groq API -> Response
"""

from flask import Blueprint, request, jsonify
from services.groq_client import generate_completion

describe_bp = Blueprint('describe', __name__)

@describe_bp.route('/describe', methods=['POST'])
def describe_training():
    """
    POST /describe
    Input:  {"title": "Cyber Security Training"}
    Output: {"description": "This training teaches cybersecurity best practices..."}
    
    Uses prompt engineering to generate a professional compliance training description.
    """
    try:
        data = request.get_json()
        
        # Validate input - title is required
        if not data or not data.get('title'):
            return jsonify({"error": "Title is required"}), 400
        
        title = data['title']
        
        # Prompt engineering: Craft a specific prompt for compliance training descriptions
        # The prompt instructs the LLM to generate professional, concise descriptions
        prompt = f"""You are a compliance training expert. Generate a professional and concise 
description for a compliance training titled "{title}". 

The description should:
- Be 2-3 sentences long
- Explain what the training covers
- Mention the key learning objectives
- Be suitable for a corporate training catalog

Return ONLY the description text, no quotes or extra formatting."""
        
        # Call Groq API to generate the description
        description = generate_completion(prompt)
        
        return jsonify({"description": description})
    
    except Exception as e:
        # Fallback response if AI service fails
        print(f"Error in /describe: {str(e)}")
        return jsonify({
            "description": f"A comprehensive compliance training covering {data.get('title', 'the specified topic')}. "
                          "This course provides essential knowledge and practical guidelines for organizational compliance."
        })
