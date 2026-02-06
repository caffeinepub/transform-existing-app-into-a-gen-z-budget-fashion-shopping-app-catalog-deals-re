import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X } from 'lucide-react';
import { VibeTag } from '../../backend';
import type { FilterState } from '../../utils/shopFilters';

interface FilterSheetProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const vibeOptions: VibeTag[] = [
  VibeTag.streetwear,
  VibeTag.Y2K,
  VibeTag.minimal,
  VibeTag.party,
  VibeTag.casual,
];

export default function FilterSheet({ filters, onFiltersChange }: FilterSheetProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      priceRange: [0, 200],
      trendTags: [],
      vibeTags: [],
      sortBy: 'newest',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const toggleVibe = (vibe: VibeTag) => {
    setLocalFilters(prev => ({
      ...prev,
      vibeTags: prev.vibeTags.includes(vibe)
        ? prev.vibeTags.filter(v => v !== vibe)
        : [...prev.vibeTags, vibe],
    }));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="space-y-3">
            <Label>Price Range: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}</Label>
            <Slider
              min={0}
              max={200}
              step={5}
              value={localFilters.priceRange}
              onValueChange={(value) => setLocalFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
            />
          </div>

          <div className="space-y-3">
            <Label>Vibe</Label>
            <div className="flex flex-wrap gap-2">
              {vibeOptions.map((vibe) => (
                <Badge
                  key={vibe}
                  variant={localFilters.vibeTags.includes(vibe) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleVibe(vibe)}
                >
                  {vibe}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Sort By</Label>
            <div className="flex flex-col gap-2">
              {[
                { value: 'newest', label: 'Newest' },
                { value: 'price-asc', label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={localFilters.sortBy === option.value ? 'default' : 'outline'}
                  onClick={() => setLocalFilters(prev => ({ ...prev, sortBy: option.value as any }))}
                  className="justify-start"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
