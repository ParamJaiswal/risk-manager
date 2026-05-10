"""
Recommend Route - Generates compliance recommendations using Groq LLM.

Flow: Frontend -> Spring Boot -> Flask /recommend -> Groq API -> Response
"""

from flask import Blueprint, request, jsonify
from services.groq_client import generate_completion
import json

recommend_bp = Blueprint('recommend', __name__)

@recommend_bp.route('/recommend', methods=['POST'])
def recommend():
    """
    POST /recommend
    Input:  {"training": "Password Security"}
    Output: {"recommendations": ["Enable MFA", "Use strong passwords", ...]}
    
    Uses Groq LLM to generate actionable compliance recommendations.
    """
    try:
        data = request.get_json()
        
        # Validate input - training topic is required
        if not data or not data.get('training'):
            return jsonify({"error": "Training topic is required"}), 400
        
        training = data['training']
        
        # Prompt engineering: Ask the LLM to return a JSON array of recommendations
        # We instruct the model to return a specific format for easy parsing
        prompt = f"""You are a compliance training expert. Generate exactly 5 actionable 
compliance recommendations for the training topic: "{training}".

Return ONLY a JSON array of strings, like this format:
["Recommendation 1", "Recommendation 2", "Recommendation 3", "Recommendation 4", "Recommendation 5"]

Each recommendation should be:
- Specific and actionable
- Relevant to the training topic
- Suitable for corporate compliance

Return ONLY the JSON array, nothing else."""
        
        # Call Groq API
        response_text = generate_completion(prompt)
        
        # Parse the JSON array from the LLM response
        try:
            # Try to extract JSON array from the response
            # Sometimes LLMs wrap the array in markdown code blocks
            cleaned = response_text.strip()
            if cleaned.startswith('```'):
                cleaned = cleaned.split('\n', 1)[1]
                cleaned = cleaned.rsplit('```', 1)[0]
            recommendations = json.loads(cleaned)
        except json.JSONDecodeError:
            # If parsing fails, split by newlines and clean up
            recommendations = [
                line.strip().lstrip('0123456789.-) ') 
                for line in response_text.strip().split('\n') 
                if line.strip() and len(line.strip()) > 3
            ][:5]
        
        return jsonify({"recommendations": recommendations})
    
    except Exception as e:
        # Fallback recommendations if AI service fails
        print(f"Error in /recommend: {str(e)}")
        return jsonify({
            "recommendations": [
                "Conduct regular training sessions",
                "Implement monitoring and auditing",
                "Create clear documentation and policies",
                "Establish incident response procedures",
                "Perform periodic compliance assessments"
            ]
        })
