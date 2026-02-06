import { useNavigate } from '@tanstack/react-router';
import { Category } from '../../backend';

const categories = [
  { id: 'clothing', label: 'Clothing', icon: '👕' },
  { id: 'accessories', label: 'Accessories', icon: '👜' },
  { id: 'footwear', label: 'Footwear', icon: '👟' },
];

export default function CategoryStrip() {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => navigate({ to: '/search', search: { category: cat.id } })}
          className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-xl bg-card border-2 border-border hover:border-primary transition-all hover:scale-105"
        >
          <span className="text-3xl">{cat.icon}</span>
          <span className="text-xs font-medium">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
