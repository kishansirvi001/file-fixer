from io import BytesIO
from pathlib import Path
from tempfile import TemporaryDirectory
import re
import textwrap

import fitz
from docx import Document
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pdf2docx import Converter
from starlette.responses import Response

app = FastAPI(title="FileFixer document tools")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"] ,
    allow_headers=["*"],
)


def safe_name(filename: str, extension: str) -> str:
    stem = Path(filename).stem or "converted"
    stem = re.sub(r"[^A-Za-z0-9._-]+", "_", stem)
    return f"{stem}{extension}"


async def read_upload(file: UploadFile) -> bytes:
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")
    return data


@app.post("/convert")
async def pdf_to_word(file: UploadFile = File(...)):
    data = await read_upload(file)
    try:
        with TemporaryDirectory() as directory:
            source = Path(directory) / "source.pdf"
            target = Path(directory) / "converted.docx"
            source.write_bytes(data)
            converter = Converter(str(source))
            try:
                converter.convert(str(target))
            finally:
                converter.close()
            output = target.read_bytes()
    except Exception as error:
        raise HTTPException(status_code=422, detail=f"PDF conversion failed: {error}") from error
    return Response(
        content=output,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{safe_name(file.filename or "document.pdf", ".docx")}"'},
    )


@app.post("/protect-pdf")
async def protect_pdf(file: UploadFile = File(...), password: str = Form(...)):
    if not password:
        raise HTTPException(status_code=400, detail="Enter a password.")
    try:
        document = fitz.open(stream=await read_upload(file), filetype="pdf")
        output = document.tobytes(
            encryption=fitz.PDF_ENCRYPT_AES_256,
            owner_pw=password,
            user_pw=password,
        )
        document.close()
    except Exception as error:
        raise HTTPException(status_code=422, detail=f"Could not protect this PDF: {error}") from error
    return Response(content=output, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="{safe_name(file.filename or "document.pdf", "-protected.pdf")}"'})


@app.post("/unlock-pdf")
async def unlock_pdf(file: UploadFile = File(...), password: str = Form(...)):
    try:
        document = fitz.open(stream=await read_upload(file), filetype="pdf")
        if document.needs_pass and not document.authenticate(password):
            raise HTTPException(status_code=400, detail="The password is incorrect.")
        output = document.tobytes(encryption=fitz.PDF_ENCRYPT_NONE, garbage=4, deflate=True)
        document.close()
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=422, detail=f"Could not unlock this PDF: {error}") from error
    return Response(content=output, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="{safe_name(file.filename or "document.pdf", "-unlocked.pdf")}"'})


@app.post("/word-to-pdf")
async def word_to_pdf(file: UploadFile = File(...)):
    try:
        word = Document(BytesIO(await read_upload(file)))
        pdf = fitz.open()
        page = pdf.new_page()
        x, y = 48, 54
        for block in word.element.body.iterchildren():
            if isinstance(block, CT_P):
                text = Paragraph(block, word).text.strip()
            elif isinstance(block, CT_Tbl):
                table = Table(block, word)
                text = "\n".join(" | ".join(cell.text.strip() for cell in row.cells) for row in table.rows)
            else:
                continue
            if not text:
                y += 12
                continue
            for line in textwrap.wrap(text, width=95, replace_whitespace=False, drop_whitespace=True) or [""]:
                if y > page.rect.height - 48:
                    page = pdf.new_page()
                    y = 54
                page.insert_text((x, y), line, fontsize=11)
                y += 20
        output = pdf.tobytes()
        pdf.close()
    except Exception as error:
        raise HTTPException(status_code=422, detail=f"Word conversion failed: {error}") from error
    return Response(content=output, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="{safe_name(file.filename or "document.docx", ".pdf")}"'})
