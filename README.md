# MI 11 Agents

An interactive chat interface with themed agents (Moneypenny, Q, and Bond) for data science problem analysis and code generation.

## Features

- Conversational interface with Moneypenny
- Data science problem analysis workflow
- Interactive UI with themed elements
- Download conversation summaries

## Project Structure

- `app.py`: Flask backend application
- `logic.py`: Core business logic
- `frontend/`: React frontend application

## Setup and Installation

### Backend Setup

1. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the Flask backend:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Usage

1. Open your browser and visit http://localhost:3000
2. Interact with Moneypenny to describe your data science problem
3. Progress through the workflow to analyze and generate code for your problem
