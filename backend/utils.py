import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_bytes
from PyPDF2 import PdfMerger
from io import BytesIO
from fastapi import UploadFile


class Utils:

    @staticmethod
    async def needs_ocr(file, min_chars=50):
        # Reset file pointer to beginning in case it was already read
        await file.seek(0)
        file_content = await file.read()
        doc = fitz.open(stream=file_content, filetype="pdf")
        total_text = 0
        for page in doc:
            text = page.get_text()
            total_text += len(text.strip())
            if total_text >= min_chars:
                await file.seek(0)
                return False  # enough text → no OCR needed
        await file.seek(0)
        return True  # little/no text → OCR required

    @staticmethod
    async def convert_pdf_to_searchable(input_file: UploadFile) -> UploadFile:
        # Reset file pointer to beginning in case it was already read
        await input_file.seek(0)
        file_content = await input_file.read()

        # Convert PDF to images
        pages = convert_from_bytes(file_content)

        merger = PdfMerger()

        # OCR each page and add to final PDF
        for page in pages:
            pdf_bytes = pytesseract.image_to_pdf_or_hocr(page, extension="pdf")
            merger.append(BytesIO(pdf_bytes))

        # Return combined searchable PDF as a BytesIO object
        output_pdf = BytesIO()
        merger.write(output_pdf)
        output_pdf.seek(0)  # Reset the stream position to the beginning
        await input_file.seek(0)

        return UploadFile(file=output_pdf, filename=input_file.filename)
