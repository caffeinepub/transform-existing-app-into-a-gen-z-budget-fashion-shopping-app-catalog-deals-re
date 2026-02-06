import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { UserProfile } from '../../backend';
import { VibeTag, Category } from '../../backend';
import { toast } from 'sonner';

interface PreferencesFormProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => Promise<void>;
}

const vibeOptions: VibeTag[] = [
  VibeTag.streetwear,
  VibeTag.Y2K,
  VibeTag.minimal,
  VibeTag.party,
  VibeTag.casual,
];

const categoryOptions: Category[] = [
  Category.clothing,
  Category.accessories,
  Category.footwear,
];

export default function PreferencesForm({ profile, onSave }: PreferencesFormProps) {
  const [budgetRange, setBudgetRange] = useState<[number, number]>([
    Number(profile.stylePreferences.budgetRange[0]),
    Number(profile.stylePreferences.budgetRange[1]),
  ]);
  const [preferredVibes, setPreferredVibes] = useState<VibeTag[]>(profile.stylePreferences.preferredVibes);
  const [preferredCategories, setPreferredCategories] = useState<Category[]>(
    profile.stylePreferences.preferredCategories
  );
  const [isSaving, setIsSaving] = useState(false);

  const toggleVibe = (vibe: VibeTag) => {
    setPreferredVibes(prev =>
      prev.includes(vibe) ? prev.filter(v => v !== vibe) : [...prev, vibe]
    );
  };

  const toggleCategory = (category: Category) => {
    setPreferredCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedProfile: UserProfile = {
        ...profile,
        stylePreferences: {
          ...profile.stylePreferences,
          budgetRange: [BigInt(budgetRange[0]), BigInt(budgetRange[1])],
          preferredVibes,
          preferredCategories,
        },
      };
      await onSave(updatedProfile);
      toast.success('Preferences saved!');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Budget Range: ${budgetRange[0]} - ${budgetRange[1]}</Label>
        <Slider
          min={0}
          max={200}
          step={5}
          value={budgetRange}
          onValueChange={(value) => setBudgetRange(value as [number, number])}
        />
      </div>

      <div className="space-y-3">
        <Label>Preferred Vibes</Label>
        <div className="flex flex-wrap gap-2">
          {vibeOptions.map((vibe) => (
            <Badge
              key={vibe}
              variant={preferredVibes.includes(vibe) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleVibe(vibe)}
            >
              {vibe}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Preferred Categories</Label>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((category) => (
            <Badge
              key={category}
              variant={preferredCategories.includes(category) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        {isSaving ? 'Saving...' : 'Save Preferences'}
      </Button>
    </div>
  );
}
