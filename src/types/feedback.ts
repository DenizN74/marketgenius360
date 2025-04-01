export interface Feedback {
  id: string;
  user_id: string | null;
  feedback_type: 'bug' | 'feature' | 'general';
  title: string;
  description: string;
  status: 'new' | 'reviewed' | 'in-progress' | 'resolved';
  created_at: string;
  updated_at: string;
}