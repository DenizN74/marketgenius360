import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import type { Feedback } from '../types/feedback';

interface FeedbackSubmission {
  feedbackType: 'bug' | 'feature' | 'general';
  title: string;
  description: string;
}

export function useFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (submission: FeedbackSubmission) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('feedback').insert([{
        feedback_type: submission.feedbackType,
        title: submission.title,
        description: submission.description,
      }]);

      if (error) throw error;
      await fetchFeedback();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFeedbackStatus = async (id: string, status: Feedback['status']) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await fetchFeedback();
      toast.success('Feedback status updated');
    } catch (error) {
      console.error('Error updating feedback status:', error);
      toast.error('Failed to update feedback status');
    } finally {
      setLoading(false);
    }
  };

  return {
    feedback,
    loading,
    submitFeedback,
    updateFeedbackStatus,
  };
}