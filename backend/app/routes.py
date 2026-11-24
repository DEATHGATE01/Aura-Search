import asyncio
import json
import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from pydantic import BaseModel

from app.queue import job_queue

logger = logging.getLogger(__name__)

router = APIRouter()


class ChatRequest(BaseModel):
    query: str


@router.post("/chat")
async def chat_endpoint(request: ChatRequest) -> dict:
    """Enqueue chat request, return job_id"""
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    job_id = await job_queue.enqueue(request.query)
    return {
        "job_id": job_id,
        "status_url": f"/api/stream/{job_id}"
    }


@router.get("/stream/{job_id}")
async def stream_endpoint(job_id: str):
    """Server-Sent Events stream for chat response"""
    job = job_queue.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    async def event_generator():
        sent_count = 0

        while True:
            # Send any new results
            if len(job.results) > sent_count:
                for event in job.results[sent_count:]:
                    yield f"data: {json.dumps(event)}\n\n"
                sent_count = len(job.results)

            # Check if job is done
            if job.status in ["completed", "failed"]:
                # Send any remaining results
                if len(job.results) > sent_count:
                    for event in job.results[sent_count:]:
                        yield f"data: {json.dumps(event)}\n\n"
                break

            await asyncio.sleep(0.05)

        yield f"data: {json.dumps({'type': 'done', 'status': job.status, 'error': job.error})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/job/{job_id}")
async def get_job(job_id: str):
    """Get job status"""
    job = job_queue.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {
        "id": job.id,
        "status": job.status,
        "query": job.user_query,
        "result_count": len(job.results),
        "error": job.error
    }
