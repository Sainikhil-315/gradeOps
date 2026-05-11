import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

try:
    res = supabase.table("pipeline_jobs").select("*", count="exact").limit(1).execute()
    print(f"Table 'pipeline_jobs' exists. Count: {res.count}")
except Exception as e:
    print(f"Error checking 'pipeline_jobs' table: {e}")

try:
    res = supabase.table("submissions").select("id, status").limit(5).execute()
    print(f"Recent submissions: {res.data}")
except Exception as e:
    print(f"Error checking 'submissions' table: {e}")
