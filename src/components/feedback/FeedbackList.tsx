import React from 'react';
import { Bug, Lightbulb, MessageSquare, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { useFeedback } from '../../hooks/useFeedback';
import type { Feedback } from '../../types/feedback';

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  reviewed: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
};

const typeIcons = {
  bug: Bug,
  feature: Lightbulb,
  general: MessageSquare,
};

export function FeedbackList() {
  const { feedback, loading, updateFeedbackStatus } = useFeedback();
  const [filter, setFilter] = React.useState({
    type: 'all',
    status: 'all',
  });

  const filteredFeedback = feedback.filter((item) => {
    if (filter.type !== 'all' && item.feedback_type !== filter.type) return false;
    if (filter.status !== 'all' && item.status !== filter.status) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">All Types</option>
          <option value="bug">Bugs</option>
          <option value="feature">Feature Requests</option>
          <option value="general">General Feedback</option>
        </select>

        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredFeedback.map((item) => {
          const Icon = typeIcons[item.feedback_type];
          return (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                  {item.status}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
                <select
                  value={item.status}
                  onChange={(e) => updateFeedbackStatus(item.id, e.target.value as Feedback['status'])}
                  className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          );
        })}

        {filteredFeedback.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No feedback matches your current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}