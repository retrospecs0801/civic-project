import { useState, useEffect } from 'react';
import { Issue } from '@/types';

const STORAGE_KEY = 'civic-issues';

export const useLocalStorage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setIssues(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored issues:', error);
      }
    }
  }, []);

  const saveIssue = (issue: Issue) => {
    const updatedIssues = [...issues, issue];
    setIssues(updatedIssues);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIssues));
  };

  const updateIssue = (id: string, updates: Partial<Issue>) => {
    const updatedIssues = issues.map(issue =>
      issue.id === id ? { ...issue, ...updates } : issue
    );
    setIssues(updatedIssues);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIssues));
  };

  const deleteIssue = (id: string) => {
    const updatedIssues = issues.filter(issue => issue.id !== id);
    setIssues(updatedIssues);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIssues));
  };

  const updateIssueStatus = (id: string, status: Issue['status']) => {
    updateIssue(id, { status });
  };

  return { issues, saveIssue, updateIssue, deleteIssue, updateIssueStatus };
};