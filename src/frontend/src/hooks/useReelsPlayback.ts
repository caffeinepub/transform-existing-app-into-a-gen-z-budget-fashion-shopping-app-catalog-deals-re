import { useState, useCallback } from 'react';

export function useReelsPlayback() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex(prev => prev + 1);
  }, []);

  const goToPrevious = useCallback(() => {
    setActiveIndex(prev => Math.max(0, prev - 1));
  }, []);

  return {
    activeIndex,
    isMuted,
    isPlaying,
    setActiveIndex,
    toggleMute,
    togglePlay,
    goToNext,
    goToPrevious,
  };
}
