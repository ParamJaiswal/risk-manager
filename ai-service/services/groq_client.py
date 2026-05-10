"""
Groq Client - Wrapper for calling the Groq API.

Groq provides fast inference for open-source LLMs like LLaMA.
We use the Groq Python SDK to make API calls.

The GROQ_API_KEY is loaded from the .env file.
"""

import os
from groq import Groq

# Initialize the Groq client with API key from environment
# The API key is loaded from .env file by python-dotenv in app.py
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Model to use - llama3-8b-8192 is fast and works well for compliance text
# You can change this to other models like "llama3-70b-8192" for better quality
MODEL = "llama3-8b-8192"


def generate_completion(prompt, max_tokens=1024, temperature=0.7):
    """
    Send a prompt to Groq API and return the generated text.
    
    Args:
        prompt (str): The prompt to send to the LLM
        max_tokens (int): Maximum tokens in the response
        temperature (float): Controls randomness (0 = deterministic, 1 = creative)
    
    Returns:
        str: The generated text from the LLM
    
    How it works:
    1. We send the prompt as a "user" message to the Groq chat API
    2. The "system" message sets the AI's role as a compliance expert
    3. Groq processes the request using the specified LLM model
    4. We extract and return the text from the response
    """
    try:
        # Make the API call to Groq
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional compliance training expert. "
                              "Provide accurate, concise, and actionable responses."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model=MODEL,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        
        # Extract the generated text from the response
        return chat_completion.choices[0].message.content.strip()
    
    except Exception as e:
        print(f"Groq API error: {str(e)}")
        raise Exception(f"Failed to generate AI response: {str(e)}")
