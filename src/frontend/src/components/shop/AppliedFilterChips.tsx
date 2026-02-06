import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { FilterState } from '../../utils/shopFilters';

interface AppliedFilterChipsProps {
  filters: FilterState;
  onRemoveFilter: (type: 'vibe' | 'price' | 'all', value?: any) => void;
}

export default function AppliedFilterChips({ filters, onRemoveFilter }: AppliedFilterChipsProps) {
  const hasFilters = filters.vibeTags.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 200;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-muted-foreground">Filters:</span>
      {filters.vibeTags.map((vibe) => (
        <Badge key={vibe} variant="secondary" className="gap-1">
          {vibe}
          <X className="w-3 h-3 cursor-pointer" onClick={() => onRemoveFilter('vibe', vibe)} />
        </Badge>
      ))}
      {(filters.priceRange[0] > 0 || filters.priceRange[1] < 200) && (
        <Badge variant="secondary" className="gap-1">
          ${filters.priceRange[0]} - ${filters.priceRange[1]}
          <X className="w-3 h-3 cursor-pointer" onClick={() => onRemoveFilter('price')} />
        </Badge>
      )}
      <button
        onClick={() => onRemoveFilter('all')}
        className="text-xs text-primary hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
