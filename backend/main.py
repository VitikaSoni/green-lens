from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from dotenv import load_dotenv
import os
import io
import uuid
import json
import asyncio
from fastapi.responses import StreamingResponse
import shutil
from llama_index.llms.openai import OpenAI

# Load environment variables
load_dotenv()
from settings import settings
from pipeline import Pipeline
import boto3
from pdf_service import PDFService

# Initialize FastAPI app
app = FastAPI(
    title="GreenLens Backend",
    description="Backend for GreenLens PDF processing application",
    version="1.0.0",
    debug=True,
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "greenlens-backend"}


def sse_event(data: dict):
    """Format dict as SSE message."""
    return f"data: {json.dumps(data)}\n\n"


@app.get("/process/{file_key}")
async def process(file_key: str):
    """Consumer: Creates a queue and starts the pipeline, then streams events from the queue."""
    queue = asyncio.Queue()
    pipeline_service = Pipeline()

    # Start the pipeline as a background task
    asyncio.create_task(
        pipeline_service.run_pipeline(file_key, queue, settings.esg_query)
    )

    async def event_stream():
        while True:
            try:
                event = await queue.get()
                yield sse_event(event)

                if event.get("step") == "Done" or event.get("type") == "error":
                    break
            except asyncio.CancelledError:
                break

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload a PDF file to Firebase Storage"""

    file_key = f"{uuid.uuid4()}.pdf"

    try:
        # Validate file type
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        await PDFService().upload_pdf(file, file_key)

        return JSONResponse(
            status_code=200,
            content={
                "message": "PDF uploaded successfully",
                "original_filename": file.filename,
                "file_size": file.size,
                "file_key": file_key,
                "file_url": f"{os.getenv('R2_BUCKET_ENDPOINT')}/{file_key}",
            },
        )

    except Exception as e:
        import traceback

        print("Error uploading file:", str(e))
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error uploading file: {str(e)}. Doc ID: {file_key.replace('.pdf', '')}",
        )
