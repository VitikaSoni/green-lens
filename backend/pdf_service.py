from fastapi import UploadFile, HTTPException
import io
import uuid
import os
from typing import Tuple
from utils import Utils
from settings import settings
import boto3


class PDFService:
    def __init__(self):
        self.s3_client = self._init_s3_client()

    def _init_s3_client(self):
        return boto3.client(
            service_name="s3",
            endpoint_url=settings.r2_endpoint,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )

    async def upload_pdf(self, file: UploadFile, file_key: str) -> Tuple[str, str]:
        """Upload PDF and return file key and temp path"""

        # Process file content
        if await Utils.needs_ocr(file):
            try:
                converted_file = await Utils.convert_pdf_to_searchable(file)
                file_content = await converted_file.read()
            except Exception as e:
                raise Exception(
                    f"Sorry, OCR won't work in the demo app (render.com had some issues with deploying in the docker runtime)",
                )
        else:
            file_content = await file.read()

        # Upload to R2
        self.s3_client.upload_fileobj(
            io.BytesIO(file_content),
            Bucket=settings.r2_bucket_name,
            Key=file_key,
        )

        # Save to local temp
        temp_path = self._save_to_temp(file_key, file_content)

        print(f"Uploaded file as {file_key}")

        return temp_path

    def _save_to_temp(self, file_key: str, content: bytes) -> str:
        temp_dir = f"temp/{file_key.replace('.pdf', '')}"
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, file_key)

        with open(temp_path, "wb") as f:
            f.write(content)

        return temp_path
