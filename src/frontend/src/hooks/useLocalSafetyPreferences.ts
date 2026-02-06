import { useState, useEffect, useCallback } from 'react';
import { Principal } from '@dfinity/principal';

interface SafetyPreferences {
  mutedUsers: string[];
  blockedUsers: string[];
}

const STORAGE_KEY = 'kindlink_safety_preferences';

export function useLocalSafetyPreferences() {
  const [preferences, setPreferences] = useState<SafetyPreferences>({
    mutedUsers: [],
    blockedUsers: [],
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load safety preferences:', error);
    }
  }, []);

  const savePreferences = useCallback((newPrefs: SafetyPreferences) => {
    setPreferences(newPrefs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    } catch (error) {
      console.warn('Failed to save safety preferences:', error);
    }
  }, []);

  const muteUser = useCallback(
    (principal: Principal) => {
      const principalStr = principal.toString();
      if (!preferences.mutedUsers.includes(principalStr)) {
        savePreferences({
          ...preferences,
          mutedUsers: [...preferences.mutedUsers, principalStr],
        });
      }
    },
    [preferences, savePreferences]
  );

  const unmuteUser = useCallback(
    (principal: Principal) => {
      const principalStr = principal.toString();
      savePreferences({
        ...preferences,
        mutedUsers: preferences.mutedUsers.filter((p) => p !== principalStr),
      });
    },
    [preferences, savePreferences]
  );

  const blockUser = useCallback(
    (principal: Principal) => {
      const principalStr = principal.toString();
      if (!preferences.blockedUsers.includes(principalStr)) {
        savePreferences({
          ...preferences,
          blockedUsers: [...preferences.blockedUsers, principalStr],
        });
      }
    },
    [preferences, savePreferences]
  );

  const unblockUser = useCallback(
    (principal: Principal) => {
      const principalStr = principal.toString();
      savePreferences({
        ...preferences,
        blockedUsers: preferences.blockedUsers.filter((p) => p !== principalStr),
      });
    },
    [preferences, savePreferences]
  );

  const isUserMuted = useCallback(
    (principal: Principal) => {
      return preferences.mutedUsers.includes(principal.toString());
    },
    [preferences.mutedUsers]
  );

  const isUserBlocked = useCallback(
    (principal: Principal) => {
      return preferences.blockedUsers.includes(principal.toString());
    },
    [preferences.blockedUsers]
  );

  const shouldHideContent = useCallback(
    (author: Principal) => {
      return isUserBlocked(author) || isUserMuted(author);
    },
    [isUserBlocked, isUserMuted]
  );

  return {
    preferences,
    muteUser,
    unmuteUser,
    blockUser,
    unblockUser,
    isUserMuted,
    isUserBlocked,
    shouldHideContent,
  };
}
