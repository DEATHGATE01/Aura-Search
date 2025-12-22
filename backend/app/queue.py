import asyncio
from dataclasses import dataclass, field
from uuid import uuid4
from typing import Callable, AsyncIterator, Optional
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

@dataclass
class Job:
    id: str
    user_query: str
    created_at: datetime = field(default_factory=datetime.now)
    status: str = "queued"  # queued, processing, completed, failed
    results: list[dict] = field(default_factory=list)
    error: Optional[str] = None

class AsyncJobQueue:
    def __init__(self, max_workers: int = 5):
        self.queue = asyncio.Queue()
        self.jobs: dict[str, Job] = {}
        self.max_workers = max_workers
    
    async def enqueue(self, user_query: str) -> str:
        """Enqueue a chat request, return job_id"""
        job = Job(id=str(uuid4()), user_query=user_query)
        self.jobs[job.id] = job
        await self.queue.put(job)
        return job.id
    
    async def process_jobs(self, handler: Callable):
        """Worker: process jobs from queue"""
        while True:
            job = None
            try:
                job = await self.queue.get()
                job.status = "processing"
                
                async for event in handler(job):
                    if event:
                        job.results.append(event)
                
                job.status = "completed"
            except asyncio.CancelledError:
                # Graceful shutdown - don't call task_done if we didn't get a job
                break
            except Exception as e:
                if job:
                    job.status = "failed"
                    job.error = str(e)
                    logger.error(f"Job {job.id} failed: {e}")
            finally:
                if job is not None:
                    self.queue.task_done()
    
    def get_job(self, job_id: str) -> Optional[Job]:
        return self.jobs.get(job_id)
    
    def get_job_results(self, job_id: str) -> list[dict]:
        """Get all results for a job"""
        job = self.get_job(job_id)
        return job.results if job else []

job_queue = AsyncJobQueue(max_workers=5)
