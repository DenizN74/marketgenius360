import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { useFeedback } from '../../hooks/useFeedback';

const feedbackSchema = z.object({
  feedbackType: z.enum(['bug', 'feature', 'general']),
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export function FeedbackForm() {
  const { submitFeedback, loading } = useFeedback();
  const [formData, setFormData] = React.useState<FeedbackFormData>({
    feedbackType: 'general',
    title: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = feedbackSchema.parse(formData);
      await submitFeedback(validatedData);
      toast.success('Thank you for your feedback!');
      setFormData({ feedbackType: 'general', title: '', description: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Failed to submit feedback. Please try again.');
        console.error('Feedback submission error:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Type of Feedback
        </label>
        <select
          value={formData.feedbackType}
          onChange={(e) => setFormData({ ...formData, feedbackType: e.target.value as FeedbackFormData['feedbackType'] })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="general">General Feedback</option>
          <option value="bug">Report a Bug</option>
          <option value="feature">Feature Request</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Brief summary of your feedback"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Please provide detailed information..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          loading ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        <MessageSquarePlus className="w-5 h-5 mr-2" />
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}