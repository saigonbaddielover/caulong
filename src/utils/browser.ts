export interface EmbeddedBrowserContext {
  isEmbedded: boolean;
  label: string | null;
}

export const getEmbeddedBrowserContext = (): EmbeddedBrowserContext => {
  const ua = navigator.userAgent || '';
  const rules = [
    { pattern: /FBAN|FBAV|FB_IAB|FBIOS|FB4A/i, label: 'Facebook' },
    { pattern: /Messenger/i, label: 'Messenger' },
    { pattern: /Instagram/i, label: 'Instagram' },
    { pattern: /Line\//i, label: 'LINE' },
    { pattern: /MicroMessenger/i, label: 'WeChat' },
    { pattern: /Zalo/i, label: 'Zalo' },
    { pattern: /TikTok/i, label: 'TikTok' },
  ];

  const matched = rules.find(rule => rule.pattern.test(ua));
  if (matched) return { isEmbedded: true, label: matched.label };

  const isAndroidWebView = /; wv\)/i.test(ua) || /\bVersion\/[\d.]+ Chrome\/[\d.]+ Mobile\b/i.test(ua);
  if (isAndroidWebView) return { isEmbedded: true, label: 'trình duyệt nhúng' };

  return { isEmbedded: false, label: null };
};

export const openCurrentUrlInChrome = () => {
  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  if (isIOS) {
    if (currentUrl.startsWith('https://')) {
      window.location.href = `googlechromes://${currentUrl.slice('https://'.length)}`;
      return;
    }
    if (currentUrl.startsWith('http://')) {
      window.location.href = `googlechrome://${currentUrl.slice('http://'.length)}`;
      return;
    }
  }

  if (isAndroid) {
    const url = new URL(currentUrl);
    const intentUrl = `intent://${url.host}${url.pathname}${url.search}${url.hash}#Intent;scheme=${url.protocol.replace(':', '')};package=com.android.chrome;S.browser_fallback_url=${encodedUrl};end`;
    window.location.href = intentUrl;
    return;
  }

  window.open(currentUrl, '_blank', 'noopener,noreferrer');
};

export const openCurrentUrlInExternalBrowser = () => {
  const currentUrl = window.location.href;
  const isAndroid = /Android/i.test(navigator.userAgent);

  if (isAndroid) {
    const url = new URL(currentUrl);
    const intentUrl = `intent://${url.host}${url.pathname}${url.search}${url.hash}#Intent;scheme=${url.protocol.replace(':', '')};S.browser_fallback_url=${encodeURIComponent(currentUrl)};end`;
    window.location.href = intentUrl;
    return;
  }

  window.open(currentUrl, '_blank', 'noopener,noreferrer');
};
