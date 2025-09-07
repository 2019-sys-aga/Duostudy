import io
import os
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from .ai_brains import extract_flashcards_from_text, lessons_from_flashcards
from .storage import save_progress, load_progress

# Document parsing
import mammoth  # type: ignore
from pdfminer.high_level import extract_text as pdf_extract_text  # type: ignore
from PIL import Image  # type: ignore
import pytesseract  # type: ignore

PORT = int(os.getenv("PORT", "8080"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health() -> Dict[str, bool]:
    return {"ok": True}


@app.post("/api/upload")
async def upload(file: Optional[UploadFile] = File(None), text: Optional[str] = Form(None)):
    try:
        raw_text = text or ""
        if file is not None:
            mime = file.content_type or ""
            content = await file.read()
            if mime == "application/pdf":
                # Use pdfminer.six
                with io.BytesIO(content) as bio:
                    raw_text = pdf_extract_text(bio) or ""
            elif mime == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                # Use mammoth
                with io.BytesIO(content) as bio:
                    result = mammoth.extract_raw_text(bio)
                    raw_text = result.value or ""
            elif mime.startswith("text/"):
                raw_text = content.decode("utf-8", errors="ignore")
            elif mime.startswith("image/"):
                image = Image.open(io.BytesIO(content))
                raw_text = pytesseract.image_to_string(image)
            else:
                # Fallback plain decode
                raw_text = content.decode("utf-8", errors="ignore")

        if not raw_text or len(raw_text.strip()) < 10:
            return JSONResponse(status_code=400, content={"error": "No readable text found"})

        flashcards = await extract_flashcards_from_text(raw_text)
        return {"textLength": len(raw_text), "flashcards": flashcards}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/api/generate-lesson")
async def generate_lesson(payload: Dict[str, Any]):
    try:
        flashcards: List[dict] = payload.get("flashcards", [])
        if not isinstance(flashcards, list) or not flashcards:
            return JSONResponse(status_code=400, content={"error": "flashcards[] required"})
        lessons = await lessons_from_flashcards(flashcards)
        return {"lessons": lessons}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/api/progress/save")
async def progress_save(payload: Dict[str, Any]):
    try:
        user_id = payload.get("userId") or "local"
        data = payload.get("data") or {}
        await save_progress(str(user_id), data)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/api/progress/load")
async def progress_load(payload: Dict[str, Any]):
    try:
        user_id = payload.get("userId") or "local"
        data = await load_progress(str(user_id))
        return {"data": data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# Serve frontend build if present
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")