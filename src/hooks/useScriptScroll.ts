// src/hooks/useScriptScroll.ts
import { useRef, useEffect } from 'react';

export const useScriptScroll = (isPlaying: boolean, scrollSpeed: number) => {
  const scrollY = useRef(0);
  const animationRef = useRef<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const scroll = () => {
    if (!scrollViewRef.current || !isPlaying) return;
    
    scrollY.current += scrollSpeed;
    scrollViewRef.current?.scrollTo({
      y: scrollY.current,
      animated: false,
    });
    
    animationRef.current = requestAnimationFrame(scroll);
  };

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(scroll);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, scrollSpeed]);

  return {
    scrollViewRef,
    scrollY,
    updateScrollPosition: (y: number) => {
      scrollY.current = y;
    },
  };
};