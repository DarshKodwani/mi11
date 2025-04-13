import requests
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Azure DeepSeek model configuration
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")
AZURE_API_KEY = os.getenv("AZURE_API_KEY")

# Step 1: Document Analysis
def analyze_document(document_text):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AZURE_API_KEY}"
    }
    payload = {
        "messages": [
            {"role": "system", "content": "You are a data science assistant. Analyze the provided document and generate 2-3 hypotheses about the data science problem described."},
            {"role": "user", "content": document_text}
        ],
        "max_tokens": 500
    }
    response = requests.post(AZURE_ENDPOINT, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

# Step 2: Define Data Requirements
def define_data_requirements(hypothesis):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AZURE_API_KEY}"
    }
    payload = {
        "messages": [
            {"role": "system", "content": "You are a data science assistant. Define the data requirements needed to test the following hypothesis."},
            {"role": "user", "content": hypothesis}
        ],
        "max_tokens": 300
    }
    response = requests.post(AZURE_ENDPOINT, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

# Step 3: Generate Analysis Plan
def generate_analysis_plan(hypothesis):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AZURE_API_KEY}"
    }
    payload = {
        "messages": [
            {"role": "system", "content": "You are a data science assistant. Create an analysis plan for the following hypothesis, including models, feature engineering, and evaluation metrics."},
            {"role": "user", "content": hypothesis}
        ],
        "max_tokens": 500
    }
    response = requests.post(AZURE_ENDPOINT, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

# Step 4: Generate Codebase
def generate_code(analysis_plan):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AZURE_API_KEY}"
    }
    payload = {
        "messages": [
            {"role": "system", "content": "You are a data science assistant. Generate Python code to implement the following analysis plan."},
            {"role": "user", "content": analysis_plan}
        ],
        "max_tokens": 1000
    }
    response = requests.post(AZURE_ENDPOINT, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

# Utility function for progress bar
def show_progress_bar():
    for percent_complete in range(100):
        time.sleep(0.01)

def clarify_problem(input_text):
    """Send input to the LLM and get a summarized understanding."""
    headers = {
        "Authorization": f"Bearer {AZURE_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "messages": [
            {"role": "system", "content": "You are a data science assistant. Summarize the following problem in 3-5 bullet points."},
            {"role": "user", "content": input_text}
        ],
        "max_tokens": 150
    }
    print("Calling LLM with payload:", payload)  # Debugging statement to log the payload
    response = requests.post(AZURE_ENDPOINT, headers=headers, json=payload)
    print("LLM Response Status Code:", response.status_code)  # Debugging statement to log the status code
    print("LLM Response Text:", response.text)  # Debugging statement to log the response text
    if response.status_code == 200:
        return response.json().get("choices")[0].get("message", {}).get("content", "No summary available.").strip()
    else:
        return f"Error: {response.status_code} - {response.text}"