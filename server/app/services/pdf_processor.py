import io
import logging
from uuid import UUID
import pdfplumber
from PIL import Image
from sqlalchemy.orm import Session

from app.core.supabase import SupabaseConfig, supabase
from app.models import AnswerRegion, Submission
from app.services.answer_region_service import AnswerRegionService

logger = logging.getLogger(__name__)

class PDFProcessorService:
    """
    Service for processing student PDF submissions.
    Splits PDFs into pages/regions and prepares them for OCR and grading.
    """

    @staticmethod
    async def split_submission_into_regions(db: Session, submission_id: UUID) -> list[AnswerRegion]:
        """
        Processes a submission PDF:
        1. Downloads the PDF from Supabase storage.
        2. Splits it into pages using pdfplumber.
        3. Converts each page to an image.
        4. Uploads each image back to Supabase.
        5. Creates AnswerRegion records in the database.
        """
        submission = db.query(Submission).filter(Submission.id == submission_id).first()
        if not submission:
            raise ValueError(f"Submission {submission_id} not found")

        if not submission.pdf_url:
            raise ValueError(f"Submission {submission_id} has no PDF URL")

        logger.info(f"Processing PDF for submission {submission_id}")
        
        # 1. Download PDF using supabase client (bypasses public URL issues)
        try:
            bucket_name = SupabaseConfig.EXAM_PDFS_BUCKET
            # Extract path from public URL if possible, otherwise use a fallback
            # URL format: .../storage/v1/object/public/exam-pdfs/path/to/file.pdf
            if f"/{bucket_name}/" in submission.pdf_url:
                path = submission.pdf_url.split(f"/{bucket_name}/")[-1]
            else:
                # Fallback: try to reconstruct path if URL is weird
                logger.warning(f"Could not parse path from URL: {submission.pdf_url}")
                raise ValueError("Malformed PDF URL")

            pdf_bytes = supabase.storage.from_(bucket_name).download(path)
        except Exception as e:
            logger.error(f"Failed to download PDF: {str(e)}")
            raise RuntimeError(f"Could not download submission PDF: {str(e)}")

        regions = []
        
        # 2. Split and process
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for i, page in enumerate(pdf.pages):
                # Convert page to image
                img = page.to_image(resolution=150).original
                
                # Save image to bytes
                img_byte_arr = io.BytesIO()
                img.save(img_byte_arr, format='JPEG', quality=85)
                img_byte_arr = img_byte_arr.getvalue()
                
                # 3. Upload image to Supabase
                object_path = f"regions/{submission.exam_id}/{submission_id}/page_{i+1}.jpg"
                try:
                    supabase.storage.from_(SupabaseConfig.EXAM_PDFS_BUCKET).upload(
                        path=object_path,
                        file=img_byte_arr,
                        file_options={"content-type": "image/jpeg"}
                    )
                except Exception as e:
                    # If already exists, just get the URL
                    logger.warning(f"Image upload warning (might exist): {str(e)}")
                
                public_url = supabase.storage.from_(SupabaseConfig.EXAM_PDFS_BUCKET).get_public_url(object_path)
                
                # Extract text as a "fallback OCR" right here
                extracted_text = page.extract_text() or ""
                
                # 4. Create AnswerRegion
                region = AnswerRegion(
                    submission_id=submission_id,
                    question_id=f"Q{i+1}", # Simple mapping: 1 page = 1 question
                    image_url=public_url,
                    extracted_text=extracted_text,
                    coordinates={"page": i+1, "full_page": True}
                )
                db.add(region)
                regions.append(region)
        
        db.commit()
        logger.info(f"Created {len(regions)} answer regions for submission {submission_id}")
        return regions
