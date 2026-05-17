import time
import requests
from app.core.supabase import SessionLocal
from app.models import Exam

def main():
    db = SessionLocal()
    exam = db.query(Exam).filter(Exam.title == 'biology midterm').first()
    exam_id = str(exam.id) if exam else None
    db.close()
    
    print('Exam ID:', exam_id)
    if not exam_id:
        return
        
    endpoints = [
        f'/api/submissions?exam_id={exam_id}',
        f'/api/rubrics/exam/{exam_id}',
        f'/api/export/{exam_id}/summary',
        '/health',
        f'/api/pipeline/history/{exam_id}'
    ]
    
    for ep in endpoints:
        start = time.time()
        try:
            # We don't have a real token, so we expect 401s for protected endpoints, 
            # but they should respond IMMEDIATELY.
            res = requests.get('http://localhost:8000' + ep, timeout=5)
            print(f"{ep} -> {res.status_code} ({time.time()-start:.2f}s)")
        except Exception as e:
            print(f"{ep} -> ERROR: {str(e)}")

if __name__ == '__main__':
    main()
