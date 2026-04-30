import { useEffect, useState } from 'react';

export const useUpdateCheck = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Chỉ chạy trên production
    if (import.meta.env.DEV) return;

    const checkVersion = async () => {
      try {
        // Thêm timestamp để tránh cache
        const res = await fetch(`/version.json?t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();
        
        // __APP_VERSION__ được định nghĩa trong vite.config.ts
        const currentVersion = (window as any).__APP_VERSION__ || '0.0.0';
        
        if (data.version && data.version !== currentVersion) {
          setUpdateAvailable(true);
        }
      } catch (e) {
        console.error('Failed to check version:', e);
      }
    };

    // Kiểm tra ngay lúc mount
    checkVersion();

    // Kiểm tra mỗi 5 phút
    const interval = setInterval(checkVersion, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { updateAvailable };
};
