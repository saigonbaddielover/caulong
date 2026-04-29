import React from 'react';
import type { EmbeddedBrowserContext } from '../../utils/browser';

interface EmbeddedBrowserBlockedScreenProps {
  blockedContext: EmbeddedBrowserContext;
  onOpenInChrome: () => void;
  onOpenInExternalBrowser: () => void;
  onCopyLink: () => void;
  copyFeedback: string;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" />
    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.77-2.7.77-2.08 0-3.84-1.4-4.47-3.29H1.84v2.07A8 8 0 008.98 17z" />
    <path fill="#FBBC05" d="M4.51 10.53A4.8 4.8 0 014.26 9c0-.53.09-1.04.25-1.53V5.4H1.84A8 8 0 001 9c0 1.29.31 2.5.84 3.6l2.67-2.07z" />
    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.84 5.4L4.5 7.47c.63-1.89 2.4-3.29 4.48-3.29z" />
  </svg>
);

export const EmbeddedBrowserBlockedScreen: React.FC<EmbeddedBrowserBlockedScreenProps> = ({
  blockedContext,
  onOpenInChrome,
  onOpenInExternalBrowser,
  onCopyLink,
  copyFeedback,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f0f2f5] to-[#e8edf5]">
      <div className="bg-white p-10 max-w-sm w-full text-center rounded-[20px] border border-[#e8eaed] shadow-lg">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
          <span className="text-2xl">📅</span>
        </div>
        <h1 className="text-2xl font-bold mb-1 tracking-tight text-gray-800">Lịch Rảnh</h1>
        <div className="text-left mt-6">
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900 mb-2">Google không cho đăng nhập trong {blockedContext.label}</p>
            <p className="text-xs leading-6 text-amber-800">
              Link này đang mở trong trình duyệt nhúng của app chat. Mày cần mở bằng trình duyệt ngoài như Chrome hoặc Safari rồi mới đăng nhập được.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={onOpenInChrome}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-[#04BADE] text-white hover:bg-[#03a6c7] transition-all font-medium text-sm shadow-sm"
            >
              <GoogleIcon />
              Mở bằng Chrome
            </button>
            <button
              onClick={onOpenInExternalBrowser}
              className="w-full px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all font-medium text-sm"
            >
              Mở bằng trình duyệt ngoài
            </button>
            <button
              onClick={onCopyLink}
              className="w-full px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all font-medium text-sm"
            >
              {copyFeedback || 'Sao chép link'}
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-5 leading-5 italic">
            Nếu app không tự bật Chrome, bấm menu của {blockedContext.label} rồi chọn mở bằng browser ngoài.
          </p>
        </div>
      </div>
    </div>
  );
};
