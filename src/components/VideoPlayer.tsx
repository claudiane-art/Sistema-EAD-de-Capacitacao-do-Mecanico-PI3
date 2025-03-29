import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  onComplete: () => void;
}

export function VideoPlayer({ videoUrl, onComplete }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  // Função para inicializar o player do YouTube
  useEffect(() => {
    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      // @ts-ignore
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event: any) => {
            const duration = event.target.getDuration();
            setDuration(duration);
            // Inicia o polling de progresso
            startProgressPolling(event.target);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              onComplete();
            }
          }
        }
      });
    };

    // Carrega a API do YouTube
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      tag.remove();
    };
  }, [onComplete]);

  // Função para atualizar o progresso periodicamente
  const startProgressPolling = (player: any) => {
    // Limpa qualquer intervalo existente
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    // Inicia um novo intervalo
    progressIntervalRef.current = setInterval(() => {
      try {
        if (player && player.getCurrentTime && player.getDuration) {
          const currentTime = player.getCurrentTime();
          const duration = player.getDuration();
          
          if (duration > 0) {
            const videoProgress = (currentTime / duration) * 100;
            setProgress(Math.min(videoProgress, 100));
            setCurrentTime(currentTime);
            setDuration(duration);
          }
        }
      } catch (error) {
        console.error('Erro ao atualizar progresso:', error);
      }
    }, 1000); // Atualiza a cada segundo
  };

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
        <iframe
          ref={iframeRef}
          src={`${videoUrl}?enablejsapi=1&origin=${window.location.origin}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="space-y-2">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>{isPlaying ? 'Reproduzindo...' : 'Pausado'}</span>
          <span>{Math.round(progress)}% concluído</span>
        </div>
      </div>
    </div>
  );
}