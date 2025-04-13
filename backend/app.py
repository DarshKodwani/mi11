from flask import Flask, request, jsonify
from flask_cors import CORS
from logic import clarify_problem

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Store conversation context
conversation_context = {}

@app.before_request
def log_request_info():
    print("Headers:", request.headers)
    print("Body:", request.get_data())

@app.after_request
def log_response_info(response):
    print("Response Status:", response.status)
    print("Response Data:", response.get_data(as_text=True))
    return response

@app.route('/api/clarify_problem', methods=['POST'])
def api_clarify_problem():
    data = request.json
    user_input = data.get('input', '')
    session_id = data.get('session_id', 'default')

    # Initialize session context if not already present
    if session_id not in conversation_context:
        conversation_context[session_id] = {
            "history": [],
            "message_count": 0
        }

    # Increment message count
    conversation_context[session_id]["message_count"] += 1
    message_count = conversation_context[session_id]["message_count"]

    # Add user input to conversation history
    conversation_context[session_id]["history"].append({"role": "user", "content": user_input})

    # Define the system prompt logic
    if message_count == 1:
        prompt = (
            "You are Moneypenny, a helpful assistant. For the very first message in the conversation, "
            "provide a succinct summary of the problem based on the user's input and confirm your understanding. "
            "Keep the response concise and professional."
        )
    else:
        prompt = (
            "You are Moneypenny, a helpful assistant. For follow-up messages, acknowledge the user's input, "
            "briefly summarize your updated understanding, and avoid repeating the entire problem. "
            "Keep the response concise and conversational."
        )

    # Simulate LLM response (replace this with actual LLM call logic)
    conversation_history = "\n".join([f"{entry['role'].capitalize()}: {entry['content']}" for entry in conversation_context[session_id]["history"]])
    if message_count == 1:
        response_text = (
            "Thank you for sharing the details! Here's my understanding of the problem: "
            f"{user_input}. Does this capture everything accurately?"
        )
    else:
        response_text = (
            "Got it. I've updated my understanding based on your input. Let me know if there's anything else you'd like to add."
        )

    # Add assistant response to conversation history
    conversation_context[session_id]["history"].append({"role": "assistant", "content": response_text})

    return jsonify({"response": response_text})

@app.route('/api/finalize_summary', methods=['POST'])
def finalize_summary():
    data = request.json
    session_id = data.get('session_id', 'default')

    if session_id not in conversation_context:
        return jsonify({"error": "Session not found."}), 404

    # Generate a concise and comprehensive summary
    conversation_history = "\n".join([f"{entry['role'].capitalize()}: {entry['content']}" for entry in conversation_context[session_id]["history"]])
    final_summary = (
        "Here's the final summary of the problem based on our conversation: "
        f"{conversation_history}. This will now be sent to Q for further analysis."
    )

    # Store the final summary (this could be saved to a database or passed to another service)
    conversation_context[session_id]["final_summary"] = final_summary

    return jsonify({"final_summary": final_summary})

if __name__ == '__main__':
    app.run(debug=True)