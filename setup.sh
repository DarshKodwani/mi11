#!/bin/bash

# Ensure the script is executable
if [ ! -x "$0" ]; then
    echo "Making the script executable..."
    chmod +x "$0"
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
else
    echo "Virtual environment already exists."
fi

# Activate virtual environment
source venv/bin/activate

# Upgrade pip, setuptools, and wheel
echo "Upgrading pip, setuptools, and wheel..."
pip install --upgrade pip setuptools wheel

# Install Python dependencies
echo "Installing dependencies from requirements.txt..."
pip install -r requirements.txt

# Navigate to the frontend directory and install dependencies
if [ -d "frontend" ]; then
    echo "Setting up frontend dependencies..."
    cd frontend
    if [ -f "package.json" ]; then
        if command -v npm &> /dev/null; then
            echo "Installing frontend dependencies using npm..."
            npm install
        elif command -v yarn &> /dev/null; then
            echo "Installing frontend dependencies using yarn..."
            yarn install
        else
            echo "Neither npm nor yarn is installed. Please install one of them to proceed."
        fi
    else
        echo "No package.json found in the frontend directory. Skipping frontend setup."
    fi
    cd ..
else
    echo "Frontend directory not found. Skipping frontend setup."
fi

# Notify the user that the setup is complete
echo "Setup complete. You can now run your application."