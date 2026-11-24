"""Tests for async job queue."""
import asyncio

import pytest
from app.queue import AsyncJobQueue, Job


@pytest.fixture
def job_queue():
    return AsyncJobQueue()


@pytest.mark.asyncio
async def test_create_job(job_queue):
    """Test job creation returns a job ID."""
    job_id = await job_queue.enqueue("test query")
    assert job_id is not None
    assert isinstance(job_id, str)
    assert len(job_id) > 0


@pytest.mark.asyncio
async def test_get_job_status(job_queue):
    """Test job status retrieval."""
    job_id = await job_queue.enqueue("test")
    job = job_queue.get_job(job_id)
    assert job is not None
    assert job.status == "queued"
    assert job.user_query == "test"


@pytest.mark.asyncio
async def test_job_not_found(job_queue):
    """Test non-existent job returns None."""
    job = job_queue.get_job("nonexistent-id")
    assert job is None
