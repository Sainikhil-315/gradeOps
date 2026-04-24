"""
API routes package.

Exports all route routers for inclusion in FastAPI app.
"""

from . import auth, exams, rubrics, submissions, grades, export

__all__ = ["auth", "exams", "rubrics", "submissions", "grades", "export"]
