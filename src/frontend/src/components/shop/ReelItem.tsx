import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { Product } from '../../backend';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../utils/shopFormat';

interface ReelItemProps {
  product: Product;
  isActive: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  onToggleMute: () => void;
  onTogglePlay: () => void;
}

export default function ReelItem({
  product,
  isActive,
  isMuted,
  isPlaying,
  onToggleMute,
  onTogglePlay,
}: ReelItemProps) {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const hasVideo = !!product.videoPreview;

  return (
    <div className="relative h-[calc(100vh-8rem)] snap-start flex items-center justify-center bg-black rounded-xl overflow-hidden">
      {hasVideo ? (
        <video
          ref={videoRef}
          src={product.videoPreview}
          poster={product.images[0]}
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={product.images[0] || ''}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

      {hasVideo && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full"
            onClick={onTogglePlay}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full"
            onClick={onToggleMute}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
        <div className="space-y-1">
          <h3 className="text-white text-xl font-bold">{product.name}</h3>
          <p className="text-white/80 text-sm line-clamp-2">{product.description}</p>
          <p className="text-white text-2xl font-bold">{formatPrice(product.price)}</p>
        </div>
        <Button
          onClick={() => navigate({ to: '/product/$productId', params: { productId: product.id.toString() } })}
          className="w-full gap-2"
          size="lg"
        >
          <ShoppingBag className="w-5 h-5" />
          Shop Now
        </Button>
      </div>
    </div>
  );
}
