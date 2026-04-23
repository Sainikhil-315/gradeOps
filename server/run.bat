@echo off
REM GradeOps Server Startup Script for Windows

echo ========================================
echo GradeOps Server Setup
echo ========================================

REM Check if venv exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/update dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please edit .env with your configuration values!
    pause
)

REM Start the server
echo.
echo ========================================
echo Starting GradeOps Server...
echo ========================================
echo Server will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.

python main.py

pause
