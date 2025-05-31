import { useState, useCallback } from 'react';
import { useAuth } from '@context/authContext';
import { baseUrl } from "@constants/api";
import { scheduleSessionReminder } from '@utils/notification';


export const useJoinOrLeaveSession = ({ sessionId, isParticipant, onSuccess, onError }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleJoinOrLeave = useCallback(async () => {
    if (!token) {
      onError?.('Please log in first.');
      return;
    }

    const action = isParticipant ? 'leave' : 'join';
    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/api/sessions/${sessionId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        if (action === 'join' && result.data) {
            scheduleSessionReminder(result.data); // Schedule 24h before
        }
        onSuccess?.();
      } else {
        onError?.(result.message || `Failed to ${action} the session.`);
      }
    } catch (err) {
      console.error(err);
      onError?.('Something went wrong while processing your request.');
    } finally {
      setLoading(false);
    }
  }, [sessionId, isParticipant, token, onSuccess, onError]);

  return { handleJoinOrLeave, loading };
};