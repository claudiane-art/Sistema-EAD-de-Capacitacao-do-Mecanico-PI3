import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  onComplete: () => void;
}

export function VideoPlayer({ videoUrl, onComplete }: VideoPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const playerReadyRef = useRef(false);

  // Função para extrair o ID do vídeo da URL
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Função para atualizar o progresso
  const updateProgress = () => {
    if (!playerRef.current || !playerReadyRef.current) return;

    try {
      const player = playerRef.current;
      if (typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        
        if (duration > 0) {
          const videoProgress = (currentTime / duration) * 100;
          setProgress(Math.min(videoProgress, 100));
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
    }
  };

  useEffect(() => {
    const videoId = getVideoId(videoUrl);
    if (!videoId) {
      console.error('ID do vídeo inválido:', videoUrl);
      return;
    }

    // Carrega a API do YouTube
    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT) {
          resolve();
          return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        // @ts-ignore
        window.onYouTubeIframeAPIReady = () => {
          resolve();
        };
      });
    };

    // Inicializa o player
    const initPlayer = async () => {
      try {
        await loadYouTubeAPI();

        // @ts-ignore
        const player = new window.YT.Player('youtube-player', {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            fs: 1,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              console.log('Player pronto');
              playerRef.current = event.target;
              playerReadyRef.current = true;
              
              // Configura o intervalo de atualização do progresso
              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
              }
              
              progressIntervalRef.current = setInterval(() => {
                if (playerReadyRef.current && playerRef.current) {
                  updateProgress();
                }
              }, 1000);
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                setProgress(100);
                onComplete();
              }
            },
            onError: (event: any) => {
              console.error('Erro no player do YouTube:', event);
              playerReadyRef.current = false;
            }
          }
        });
      } catch (error) {
        console.error('Erro ao inicializar player:', error);
        playerReadyRef.current = false;
      }
    };

    initPlayer();

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error('Erro ao destruir player:', error);
        }
      }
    };
  }, [videoUrl, onComplete]);

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
        <div id="youtube-player" className="w-full h-full" />
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