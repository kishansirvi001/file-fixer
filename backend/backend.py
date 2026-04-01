from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pdf2docx import Converter
import shutil
import os

app = FastAPI()

# Allow React frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/convert")
async def convert_pdf(file: UploadFile = File(...)):
    pdf_path = f"temp_{file.filename}"
    docx_path = f"{os.path.splitext(file.filename)[0]}.docx"

    # Save uploaded PDF temporarily
    with open(pdf_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Convert PDF to Word
    cv = Converter(pdf_path)
    cv.convert(docx_path)
    cv.close()

    # Clean up temp PDF
    os.remove(pdf_path)

    # Return Word file
    return FileResponse(docx_path, filename=docx_path, media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')