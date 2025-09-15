import io
from fastapi import FastAPI, File, UploadFile
import mimetypes
from fastapi.responses import StreamingResponse, Response
from minio import Minio
from contextlib import asynccontextmanager

# Initialize MinIO client outside of lifespan so it can be shared
minio_client = Minio(
    "localhost:9000",
    access_key="minioadmin",
    secret_key="minioadmin",
    secure=False
)

BUCKET_NAME = "sih"

# Define the lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # This code runs on application startup
    print("Application startup: checking MinIO bucket.")
    if not minio_client.bucket_exists(BUCKET_NAME):
        minio_client.make_bucket(BUCKET_NAME)
        print(f"Bucket '{BUCKET_NAME}' created.")
    
    yield  # The application will now handle requests
    
    # This code runs on application shutdown
    print("Application shutdown.")

# Update FastAPI app to use the lifespan handler
app = FastAPI(lifespan=lifespan)

## Upload Endpoint
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        minio_client.put_object(
            BUCKET_NAME,
            file.filename,
            io.BytesIO(await file.read()),
            length=-1,
            part_size=10*1024*1024
        )
        return {"message": f"File '{file.filename}' uploaded successfully."}
    except Exception as e:
        return {"message": f"An error occurred: {e}"}

## Download Endpoint
@app.get("/download/{object_name}")
async def download_file(object_name: str):
    try:
        response = minio_client.get_object(BUCKET_NAME, object_name)
        
        # Detect mime type based on file extension
        mime_type, _ = mimetypes.guess_type(object_name)
        if not mime_type:
            mime_type = "application/octet-stream"
        
        headers = {
            "Content-Disposition": f'attachment; filename="{object_name}"'
        }

        return StreamingResponse(
            response.stream(32 * 1024),
            media_type=mime_type,
            headers=headers
        )
    except Exception as e:
        return {"message": f"An error occurred: {e}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
