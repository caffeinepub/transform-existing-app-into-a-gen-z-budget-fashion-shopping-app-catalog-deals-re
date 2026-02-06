import { useState, useEffect, useCallback } from 'react';

interface ChallengeCompletion {
  date: string;
  completed: boolean;
  reflection?: string;
}

const STORAGE_KEY = 'kindlink_challenge_completions';

export function useDailyChallengeLocalState() {
  const [completions, setCompletions] = useState<Record<string, ChallengeCompletion>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompletions(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load challenge completions:', error);
    }
  }, []);

  const saveCompletions = useCallback((newCompletions: Record<string, ChallengeCompletion>) => {
    setCompletions(newCompletions);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCompletions));
    } catch (error) {
      console.warn('Failed to save challenge completions:', error);
    }
  }, []);

  const markCompleted = useCallback(
    (date: string, reflection?: string) => {
      saveCompletions({
        ...completions,
        [date]: { date, completed: true, reflection },
      });
    },
    [completions, saveCompletions]
  );

  const getCompletion = useCallback(
    (date: string) => {
      return completions[date] || null;
    },
    [completions]
  );

  return {
    markCompleted,
    getCompletion,
  };
}
