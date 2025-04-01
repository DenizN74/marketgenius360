/*
  # User Feedback System

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable, references auth.users)
      - `feedback_type` (enum: bug, feature, general)
      - `title` (text)
      - `description` (text)
      - `status` (enum: new, reviewed, in-progress, resolved)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `feedback` table
    - Add policies for:
      - Users can read their own feedback
      - Users can create feedback
      - Admins can read and manage all feedback
*/

-- Create feedback_type enum
CREATE TYPE feedback_type AS ENUM ('bug', 'feature', 'general');

-- Create feedback_status enum
CREATE TYPE feedback_status AS ENUM ('new', 'reviewed', 'in-progress', 'resolved');

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  feedback_type feedback_type NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status feedback_status NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage all feedback"
  ON feedback
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_type ON feedback(feedback_type);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);