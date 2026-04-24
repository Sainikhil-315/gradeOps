#!/usr/bin/env bash
# 
# Supabase Setup & Database Migration Guide
# Complete instructions for setting up GradeOps backend
# 
# This script guides you through the entire setup process
#

echo "=========================================="
echo "🎓 GradeOps Backend Setup Guide"
echo "=========================================="
echo ""

# Step 1: Supabase Web UI Setup
echo "📋 STEP 1: Supabase Project Setup (Do This in Web UI)"
echo "=========================================="
echo ""
echo "1. Go to https://supabase.com"
echo "2. Sign up or log in"
echo "3. Click 'New Project'"
echo "4. Fill in:"
echo "   - Name: gradeops"
echo "   - Database Password: [Generate strong password - SAVE IT!]"
echo "   - Region: [Choose closest to you]"
echo ""
echo "5. Click 'Create new project'"
echo "6. Wait ~2 minutes for database to be ready..."
echo ""
echo "⏸️  PAUSE HERE - Come back when the project dashboard loads"
echo ""

# Step 2: Get Credentials
echo ""
echo "📦 STEP 2: Get Your Credentials"
echo "=========================================="
echo ""
echo "1. In Supabase dashboard, click 'Settings' (left sidebar)"
echo "2. Click 'API' tab"
echo "3. Copy these values:"
echo ""
echo "   ✓ Project URL (starts with https://)"
echo "   ✓ anon public key (under 'API Keys')"
echo "   ✓ service_role key (under 'API Keys' - keep SECRET!)"
echo ""
echo "4. Also from Database Settings, get:"
echo "   ✓ Password (you set this in Step 1)"
echo ""
echo "⏸️  PAUSE HERE - Have these values ready"
echo ""

# Step 3: Create Storage Buckets
echo ""
echo "🪣 STEP 3: Create Storage Buckets"
echo "=========================================="
echo ""
echo "1. In Supabase dashboard, click 'Storage' (left sidebar)"
echo "2. Click 'New bucket' button"
echo "3. Create TWO buckets:"
echo ""
echo "   Bucket 1:"
echo "   - Name: exam-pdfs"
echo "   - Public: NO (click toggle to keep private)"
echo "   - Click 'Create bucket'"
echo ""
echo "   Bucket 2:"
echo "   - Name: answer-images"
echo "   - Public: NO (keep private)"
echo "   - Click 'Create bucket'"
echo ""
echo "⏸️  PAUSE HERE - Verify both buckets exist in Storage"
echo ""

# Step 4: Create .env File
echo ""
echo "⚙️  STEP 4: Create .env File Locally"
echo "=========================================="
echo ""
echo "1. Navigate to: server/ directory"
echo "2. Create a new file: .env"
echo "3. Copy and paste this template, filling in YOUR values:"
echo ""
cat << 'EOF'
# Supabase Configuration
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=your_anon_public_key_here
DATABASE_URL=postgresql://postgres:YOUR_DATABASE_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres

# Application Configuration
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO

# Security (keep these SECRET - don't commit to git)
SECRET_KEY=generate-a-random-string-here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# External APIs
OPENAI_API_KEY=your_openai_key_here
EOF
echo ""
echo "⏸️  PAUSE HERE - Fill in YOUR actual values"
echo "   DO NOT commit .env to git!"
echo ""

# Step 5: Run Migrations
echo ""
echo "🗄️  STEP 5: Run Database Migrations"
echo "=========================================="
echo ""
echo "1. Go to Supabase dashboard → SQL Editor"
echo "2. Click 'New query'"
echo "3. Open this file: supabase/migrations/001_pgvector.sql"
echo "4. Copy entire content"
echo "5. Paste into SQL Editor"
echo "6. Click 'Run' button"
echo ""
echo "Repeat for each migration file in order:"
echo "   ✓ 001_pgvector.sql          (enable vector extension)"
echo "   ✓ 002_users.sql              (users table)"
echo "   ✓ 003_exams.sql              (exams table)"
echo "   ✓ 004_rubrics.sql            (rubrics table)"
echo "   ✓ 005_submissions.sql        (submissions table)"
echo "   ✓ 006_answer_regions.sql     (answer_regions table)"
echo "   ✓ 007_grades.sql             (grades table with pgvector)"
echo ""
echo "After each query, check that it says 'Command Completed' (no errors)"
echo ""
echo "⏸️  PAUSE HERE - All migrations should complete successfully"
echo ""

# Step 6: Verify Tables
echo ""
echo "✅ STEP 6: Verify Database Setup"
echo "=========================================="
echo ""
echo "1. In Supabase, go to 'Table Editor' (left sidebar)"
echo "2. You should see these tables:"
echo "   ✓ users"
echo "   ✓ exams"
echo "   ✓ rubrics"
echo "   ✓ submissions"
echo "   ✓ answer_regions"
echo "   ✓ grades"
echo ""
echo "3. Click each table to verify columns are correct"
echo ""
echo "⏸️  PAUSE HERE - Verify all tables and columns"
echo ""

# Step 7: Test Backend Connection
echo ""
echo "🚀 STEP 7: Test Backend Connection"
echo "=========================================="
echo ""
echo "1. Open terminal in server/ directory"
echo "2. Create Python virtual environment:"
echo "   python -m venv venv"
echo ""
echo "3. Activate virtual environment:"
echo "   On Windows: venv\\Scripts\\activate"
echo "   On Mac/Linux: source venv/bin/activate"
echo ""
echo "4. Install dependencies:"
echo "   pip install -r requirements.txt"
echo ""
echo "5. Test connection:"
echo "   python -c 'from app.core.supabase import supabase; print(supabase.table(\"users\").select(\"*\").execute())'"
echo ""
echo "If you see: {'data': [], 'status': ...} → SUCCESS! ✓"
echo "If you see: Error → Check .env file values"
echo ""

# Step 8: Ready for Development
echo ""
echo "🎉 SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Models are defined in: server/app/models/"
echo "2. Database config in: server/app/core/supabase.py"
echo "3. Ready to build FastAPI routes"
echo ""
echo "Common Commands:"
echo "  python -m pytest                  # Run tests"
echo "  uvicorn main:app --reload        # Start dev server"
echo "  alembic upgrade head              # Run any new migrations"
echo ""
echo "Questions? Check:"
echo "  - Notion: https://www.notion.so/GradeOps-34b2d32450658101a9ded6f5979ba9b5"
echo "  - Supabase Docs: https://supabase.com/docs"
echo ""
