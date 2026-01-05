from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from datetime import datetime
import os

app = FastAPI()

# CORS (ok para portfólio)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # em produção real poderia restringir
    allow_methods=["*"],
    allow_headers=["*"],
)

# Caminhos absolutos (IMPORTANTE para Render)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = os.path.join(BASE_DIR, "downloads.db")
CV_PATH = os.path.join(BASE_DIR, "cv.pdf")


def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS downloads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip TEXT,
            user_agent TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()


init_db()


@app.get("/download-cv")
async def download_cv(request: Request):
    ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO downloads (ip, user_agent, created_at) VALUES (?, ?, ?)",
        (ip, user_agent, datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()

    return FileResponse(
        path=CV_PATH,
        media_type="application/pdf",
        filename="Rafael_CV.pdf"
    )
