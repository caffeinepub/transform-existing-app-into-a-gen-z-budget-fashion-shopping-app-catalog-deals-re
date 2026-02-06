import { useGetAllProducts } from '../../hooks/useShopQueries';
import ReelsFeed from '../../components/shop/ReelsFeed';
import ReelItem from '../../components/shop/ReelItem';
import { useReelsPlayback } from '../../hooks/useReelsPlayback';

export default function ReelsPage() {
  const { data: products = [], isLoading } = useGetAllProducts();
  const { activeIndex, isMuted, isPlaying, toggleMute, togglePlay } = useReelsPlayback();

  const reelProducts = products.filter(p => p.videoPreview || p.images.length > 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading reels...</p>
        </div>
      </div>
    );
  }

  if (reelProducts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <p className="text-muted-foreground text-center">No reels available yet</p>
      </div>
    );
  }

  return (
    <ReelsFeed>
      {reelProducts.map((product, index) => (
        <ReelItem
          key={product.id.toString()}
          product={product}
          isActive={index === activeIndex}
          isMuted={isMuted}
          isPlaying={isPlaying}
          onToggleMute={toggleMute}
          onTogglePlay={togglePlay}
        />
      ))}
    </ReelsFeed>
  );
}
