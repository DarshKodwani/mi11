#!/bin/bash

# Ensure the script is executable
if [ ! -x "$0" ]; then
    echo "Making the script executable..."
    chmod +x "$0"
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
else
    echo "Virtual environment already exists."
fi

# Activate virtual environment
source venv/bin/activate

# Upgrade pip, setuptools, and wheel
echo "Upgrading pip, setuptools, and wheel..."
pip install --upgrade pip setuptools wheel

# Install dependencies from requirements.txt with sudo
echo "Installing dependencies from requirements.txt..."
sudo pip install -r requirements.txt

# Install PyTorch
sudo pip install torch torchvision torchaudio

# Run the Streamlit app
echo "Running the Streamlit app..."
streamlit run app.py