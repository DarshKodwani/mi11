import streamlit as st
import streamlit.components.v1 as components
from logic import analyze_document, define_data_requirements, generate_analysis_plan, generate_code, show_progress_bar
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

# Add CSS for custom styling
def add_custom_css():
    st.markdown(
        """
        <style>
        .main {
            background-color: #f0f0f5;
            font-family: 'Arial', sans-serif;
        }
        .header-image {
            border-radius: 15px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        }
        .step-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            color: white;
        }
        .step-completed {
            background-color: #4CAF50;
        }
        .step-current {
            background-color: #FF9800;
        }
        .step-pending {
            background-color: #9E9E9E;
        }
        .step-label {
            margin-top: 5px;
            font-size: 14px;
            text-align: center;
        }
        </style>
        """,
        unsafe_allow_html=True
    )

# Update the workflow tracker with enhanced visuals
def display_workflow_tracker(current_step):
    steps = ["Tell Me the Problem", "Define Data Requirements", "Generate Analysis Plan", "Approve Plan and Generate Code"]
    tracker_html = "<div style='display: flex; justify-content: space-between; align-items: center;'>"
    for i, step in enumerate(steps):
        if i < current_step:
            tracker_html += f"<div style='text-align: center;'><div class='step-circle step-completed'>{i + 1}</div><p class='step-label'>{step}</p></div>"
        elif i == current_step:
            tracker_html += f"<div style='text-align: center;'><div class='step-circle step-current'>{i + 1}</div><p class='step-label'>{step}</p></div>"
        else:
            tracker_html += f"<div style='text-align: center;'><div class='step-circle step-pending'>{i + 1}</div><p class='step-label'>{step}</p></div>"
    tracker_html += "</div>"
    components.html(tracker_html, height=150)

# Apply custom CSS
add_custom_css()

# Display the workflow tracker at the top of the app
if "workflow_step" not in st.session_state:
    st.session_state["workflow_step"] = 0

st.title("Data Science Problem Analyzer")
display_workflow_tracker(st.session_state["workflow_step"])

# Upload or input document
document_text = st.text_area("Paste your document describing the data science problem:")

# Step 1: Tell Me the Problem
if st.button("Tell Me the Problem"):
    show_progress_bar()
    if document_text:
        hypotheses = analyze_document(document_text)
        st.session_state["hypotheses"] = hypotheses.split("\n")  # Store hypotheses in session state
        st.session_state["workflow_step"] = 1
        st.subheader("Generated Hypotheses")
        st.write(hypotheses)
        display_workflow_tracker(st.session_state["workflow_step"])

# Step 2: Define Data Requirements
if "hypotheses" in st.session_state:
    selected_hypothesis = st.selectbox("Select a hypothesis to proceed:", st.session_state["hypotheses"])
    if st.button("Define Data Requirements"):
        show_progress_bar()
        data_requirements = define_data_requirements(selected_hypothesis)
        st.session_state["data_requirements"] = data_requirements  # Store data requirements in session state
        st.session_state["workflow_step"] = 2
        st.subheader("Data Requirements")
        st.write(data_requirements)
        display_workflow_tracker(st.session_state["workflow_step"])

# Step 3: Generate Analysis Plan
if "data_requirements" in st.session_state:
    if st.button("Generate Analysis Plan"):
        show_progress_bar()
        analysis_plan = generate_analysis_plan(selected_hypothesis)
        st.session_state["analysis_plan"] = analysis_plan  # Store analysis plan in session state
        st.session_state["workflow_step"] = 3
        st.subheader("Analysis Plan")
        st.write(analysis_plan)
        display_workflow_tracker(st.session_state["workflow_step"])

        # Allow user to provide feedback
        user_feedback = st.text_area("Suggest changes to the analysis plan:")
        if st.button("Revise Plan"):
            revised_plan = generate_analysis_plan(user_feedback)
            st.subheader("Revised Analysis Plan")
            st.write(revised_plan)

# Step 4: Approve Plan and Generate Code
if "analysis_plan" in st.session_state:
    if st.button("Approve Plan and Generate Code"):
        show_progress_bar()
        code = generate_code(st.session_state["analysis_plan"])
        st.session_state["workflow_step"] = 4
        st.subheader("Generated Code")
        st.code(code, language="python")
        display_workflow_tracker(st.session_state["workflow_step"])