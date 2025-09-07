# syntax=docker/dockerfile:1

# 1) Build frontend
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci || npm i
COPY frontend/ ./
RUN npm run build

# 2) Backend image
FROM python:3.11-slim AS backend
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app

# System deps for OCR and build tools
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libglib2.0-0 libsm6 libxrender1 libxext6 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend
COPY backend/ /app/backend/
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy frontend build to serve statically
COPY --from=frontend /app/frontend/dist /app/frontend/dist

# Runtime
ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "backend.app.server:app", "--host", "0.0.0.0", "--port", "8080"]