import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, SkipForward } from 'lucide-react';

interface CinematicIntroProps {
  onComplete?: () => void;
  videoSrc?: string;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onComplete,
  videoSrc = `${import.meta.env.BASE_URL}IntroductionVideo.mp4`
}) => {
  const [stage, setStage] = useState<'playing' | 'blackout' | 'curtain-rising' | 'completed'>('playing');
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasTriggeredRef = useRef<boolean>(false);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Transition flow: video ended -> solid black screen appears -> curtain rises
  const startTransition = useCallback((immediate: boolean = false) => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // Pause video to free up decoding resources
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {
        // Ignore pause errors
      }
    }

    if (immediate) {
      // Direct completion for reduced-motion or hard fallbacks
      setStage('completed');
      if (onComplete) onComplete();
      return;
    }

    // Step 1: Solid black screen (#000000) appears
    setStage('blackout');

    // Step 2: After brief pause (250ms), curtain glides upward revealing the site
    setTimeout(() => {
      setStage('curtain-rising');

      // Step 3: End transition after 1400ms (matching the 1350ms CSS transform)
      setTimeout(() => {
        setStage('completed');
        if (onComplete) {
          onComplete();
        }
      }, 1400);
    }, 280);
  }, [onComplete]);

  // Lock scroll while intro is visible
  useEffect(() => {
    if (stage !== 'completed') {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.documentElement.style.overflow = '';
      };
    }
  }, [stage]);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        // If reduced motion is requested, reveal immediately
        startTransition(true);
        return;
      }
    }
  }, [startTransition]);

  // Attempt automatic video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Safety fallback: if video doesn't end within 8 seconds, automatically start transition
    safetyTimeoutRef.current = setTimeout(() => {
      if (!hasTriggeredRef.current) {
        startTransition();
      }
    }, 8000);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Autoplay policy prevented playback
        console.warn('CinematicIntro: Autoplay blocked by browser policy:', error);
        setAutoplayBlocked(true);

        // Safety fallback if user doesn't interact within 5s
        setTimeout(() => {
          if (!hasTriggeredRef.current) {
            startTransition();
          }
        }, 5000);
      });
    }

    return () => {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
    };
  }, [startTransition]);

  // Manual start if autoplay was blocked
  const handleUserPlay = () => {
    setAutoplayBlocked(false);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        startTransition();
      });
    }
  };

  if (stage === 'completed') {
    return null;
  }

  return (
    <div
      id="cinematic-intro-curtain"
      className={`fixed inset-0 z-[99999] bg-[#000000] flex items-center justify-center overflow-hidden select-none ${
        stage === 'curtain-rising' ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{
        transform: stage === 'curtain-rising' ? 'translateY(-100%)' : 'translateY(0%)',
        transition: stage === 'curtain-rising' ? 'transform 1350ms cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
        willChange: 'transform'
      }}
      aria-label="Introdução Cinematográfica"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => startTransition()}
        onError={() => startTransition()}
        className={`w-full h-full object-cover pointer-events-none transition-opacity duration-200 ${
          stage === 'playing' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Decorative Bottom Edge Glow when curtain rises */}
      {stage === 'curtain-rising' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#9448AC] to-transparent shadow-[0_15px_40px_rgba(148,72,172,0.6)]" />
      )}

      {/* Subtle Skip Button */}
      {stage === 'playing' && (
        <button
          type="button"
          onClick={() => startTransition()}
          aria-label="Pular introdução"
          className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white/80 hover:text-white border border-white/20 hover:border-white/40 text-xs font-semibold backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <span>Pular</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Autoplay Blocked Fallback Overlay */}
      {autoplayBlocked && stage === 'playing' && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30">
          <button
            type="button"
            onClick={handleUserPlay}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#480355] hover:bg-[#9448AC] text-white flex items-center justify-center shadow-[0_0_30px_rgba(148,72,172,0.5)] transition-all transform hover:scale-110 active:scale-95 cursor-pointer mb-4"
            aria-label="Reproduzir vídeo de introdução"
          >
            <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-white" />
          </button>
          <span className="text-white text-sm sm:text-base font-bold tracking-wide">
            Toque para iniciar a experiência
          </span>
          <button
            type="button"
            onClick={() => startTransition()}
            className="mt-6 text-xs text-slate-400 hover:text-white underline underline-offset-4 cursor-pointer"
          >
            Pular direto para o site
          </button>
        </div>
      )}
    </div>
  );
};
