# GradeOps Server Setup

## Quick Start

### 1. Install Dependencies
```bash
cd server
pip install -r requirements.txt
```

### 2. Create Environment File
```bash
cp .env.example .env
```
Then edit `.env` and add your actual configuration values:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase API key
- `OPENAI_API_KEY` - Your OpenAI API key
- `DATABASE_URL` - Your database connection string

### 3. Run the Server
```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Access the API
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Exams
- `POST /api/exams/upload` - Upload exam PDFs
- `GET /api/exams` - List all exams
- `GET /api/exams/{exam_id}` - Get exam details

### Rubrics
- `POST /api/rubrics/create` - Create a rubric
- `GET /api/rubrics` - List all rubrics
- `GET /api/rubrics/{rubric_id}` - Get rubric details

### Grades
- `POST /api/grades` - Create a grade
- `GET /api/grades` - List all grades
- `GET /api/grades/{grade_id}` - Get grade details

### Pipeline
- `POST /api/pipeline/process` - Process exam through grading pipeline
- `GET /api/pipeline/status/{pipeline_id}` - Get pipeline execution status

### Export
- `POST /api/export/csv` - Export grades as CSV
- `POST /api/export/excel` - Export grades as Excel

## Project Structure

```
server/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
└── app/
    ├── __init__.py
    ├── api/
    │   └── routes/        # API endpoint definitions
    ├── models/            # Database models
    ├── schemas/           # Pydantic validation schemas
    ├── services/          # Business logic services
    ├── pipeline/          # LangGraph grading pipeline
    └── core/
        ├── config.py      # Configuration management
        ├── database.py    # Database setup
        ├── supabase.py    # Supabase integration
        └── dependencies.py # FastAPI dependencies
```

## Development

### Using Virtual Environment (Recommended)
```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Running in Debug Mode
The server automatically runs in debug mode when `DEBUG=True` in `.env`

## Production Deployment

1. Set `DEBUG=False` in `.env`
2. Use a proper secret key (change `SECRET_KEY` in `.env`)
3. Deploy with Gunicorn:
```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
