from typing import Any, Dict


def build_grading_prompt(answer: str, rubric: Dict[str, Any], strict: bool = False) -> str:
    criteria = rubric.get("criteria", [])
    criteria_text = "\n".join(
        f"- {c['id']}: {c['description']} (max {c['marks']} marks)" for c in criteria
    )
    mode = (
        "Be stricter, penalize unsupported assumptions, and keep justifications concise."
        if strict
        else "Be fair and rubric-aligned."
    )
    return f"""
You are an academic examiner. {mode}

RUBRIC:
{criteria_text}
Total max marks: {rubric.get("max_marks", 0)}

STUDENT ANSWER:
{answer}

Return ONLY valid JSON with this exact shape:
{{
  "criteria": [
    {{"id": "c1", "awarded": 0, "justification": "reason"}}
  ],
  "total_awarded": 0,
  "max_marks": {rubric.get("max_marks", 0)},
  "confidence": 0.0
}}
"""
