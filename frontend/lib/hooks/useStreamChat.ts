'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/lib/store/chat-store';
import type { StreamEvent } from '@/lib/types';

export function useStreamChat(jobId: string | null) {
  const { streamEvent, setLoading, setCurrentJob } = useChatStore();
  const processedJobsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!jobId) return;
    
    // Prevent processing the same job twice
    if (processedJobsRef.current.has(jobId)) {
      return;
    }
    processedJobsRef.current.add(jobId);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const eventSource = new EventSource(`${apiUrl}/api/stream/${jobId}`);

    eventSource.onmessage = (event) => {
      try {
        const data: StreamEvent = JSON.parse(event.data);

        if (data.type === 'done') {
          eventSource.close();
          setLoading(false);
          setCurrentJob(null);
        } else {
          streamEvent(data);
        }
      } catch (error) {
        console.error('Failed to parse stream event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Stream error:', error);
      eventSource.close();
      setLoading(false);
      setCurrentJob(null);
    };

    return () => {
      eventSource.close();
    };
  }, [jobId, streamEvent, setLoading, setCurrentJob]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      processedJobsRef.current.clear();
    };
  }, []);
}
