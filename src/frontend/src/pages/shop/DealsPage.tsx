import PageContainer from '../../components/shop/PageContainer';
import DealCard from '../../components/shop/DealCard';
import { useGetActiveDeals, useGetFlashSales } from '../../hooks/useShopQueries';
import { DealCardSkeleton } from '../../components/shop/Skeletons';
import { Zap } from 'lucide-react';

export default function DealsPage() {
  const { data: activeDeals = [], isLoading: dealsLoading } = useGetActiveDeals();
  const { data: flashSales = [], isLoading: flashLoading } = useGetFlashSales();

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Deals</h1>
          <p className="text-sm text-muted-foreground">Limited time offers you can't miss</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            Flash Sales
          </h2>
          {flashLoading ? (
            <div className="space-y-3">
              <DealCardSkeleton />
              <DealCardSkeleton />
            </div>
          ) : flashSales.length === 0 ? (
            <p className="text-sm text-muted-foreground">No flash sales right now. Check back soon!</p>
          ) : (
            <div className="space-y-3">
              {flashSales.map((deal) => (
                <DealCard key={deal.id.toString()} deal={deal} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold">Daily Deals</h2>
          {dealsLoading ? (
            <div className="space-y-3">
              <DealCardSkeleton />
              <DealCardSkeleton />
            </div>
          ) : activeDeals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No deals available right now.</p>
          ) : (
            <div className="space-y-3">
              {activeDeals.map((deal) => (
                <DealCard key={deal.id.toString()} deal={deal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
