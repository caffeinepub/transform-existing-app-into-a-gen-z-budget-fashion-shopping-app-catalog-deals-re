import { useState, useEffect } from 'react';
import { useInternetIdentity } from './useInternetIdentity';

export function useWishlist() {
  const { identity } = useInternetIdentity();
  const [wishlist, setWishlist] = useState<bigint[]>([]);

  const storageKey = identity ? `wishlist_${identity.getPrincipal().toString()}` : null;

  useEffect(() => {
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setWishlist(parsed.map((id: string) => BigInt(id)));
        } catch (e) {
          setWishlist([]);
        }
      }
    } else {
      setWishlist([]);
    }
  }, [storageKey]);

  const addToWishlist = (productId: bigint) => {
    if (!storageKey) return;
    const updated = [...wishlist, productId];
    setWishlist(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated.map(id => id.toString())));
  };

  const removeFromWishlist = (productId: bigint) => {
    if (!storageKey) return;
    const updated = wishlist.filter(id => id !== productId);
    setWishlist(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated.map(id => id.toString())));
  };

  const isInWishlist = (productId: bigint) => {
    return wishlist.some(id => id === productId);
  };

  const clearWishlist = () => {
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
    setWishlist([]);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };
}
