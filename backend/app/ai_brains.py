import os
from typing import Any, List

from openai import OpenAI

MODEL = os.getenv("MODEL", "gpt-4o-mini")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

_client: OpenAI | None = None
if OPENAI_API_KEY:
    _client = OpenAI(api_key=OPENAI_API_KEY)


def _require_client() -> OpenAI:
    if _client is None:
        raise RuntimeError("OpenAI client not configured. Set OPENAI_API_KEY.")
    return _client


def safe_json(text: str) -> Any:
    try:
        start_candidates = [i for i in (text.find("["), text.find("{")) if i >= 0]
        if not start_candidates:
            raise ValueError("No JSON start found")
        start = min(start_candidates)
        end = max(text.rfind("]"), text.rfind("}")) + 1
        snippet = text[start:end]
        import json

        return json.loads(snippet)
    except Exception as e:  # pragma: no cover
        raise ValueError(f"LLM returned invalid JSON. Raw: {text[:500]}") from e


async def extract_flashcards_from_text(text: str) -> List[dict]:
    client = _require_client()
    system = (
        "You are an educational assistant. Produce JSON ONLY. Create 12 concise flashcards from the given text. "
        "Each flashcard must be an object: {\"front\":\"short prompt\",\"back\":\"one-sentence answer\",\"difficulty\":\"easy|medium|hard\",\"explanation\":\"1-2 sentence explanation\"}. "
        "Return a JSON array only."
    )
    res = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": text},
        ],
        temperature=0.2,
        max_tokens=1200,
    )
    content = (res.choices[0].message.content or "").strip()
    return safe_json(content)


async def lessons_from_flashcards(flashcards: List[dict]) -> List[dict]:
    client = _require_client()
    system = (
        "You are an educational designer. From the given flashcards (JSON array), produce 5 bite-sized lessons suitable for short 3-5 minute sessions. "
        "Each lesson must include \"title\", \"teachPoints\" (3-5 short strings), and \"questions\" (5-8 items mixing mcq, true_false, fill_blank). "
        "For mcq include options array and answerIndex. For fill_blank include \"answer\". Return JSON only."
    )
    user = f"Flashcards JSON:\n{__import__('json').dumps(flashcards)}"
    res = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.35,
        max_tokens=1600,
    )
    content = (res.choices[0].message.content or "").strip()
    return safe_json(content)