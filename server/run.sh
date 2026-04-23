#!/bin/bash

# GradeOps Server Startup Script for Linux/macOS

echo "========================================"
echo "GradeOps Server Setup"
echo "========================================"

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env with your configuration values!"
fi

# Start the server
echo ""
echo "========================================"
echo "Starting GradeOps Server..."
echo "========================================"
echo "Server will be available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo ""

python main.py
