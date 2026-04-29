import React from 'react';

interface LoginScreenProps {
  onLogin: () => void;
  loading: boolean;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" />
    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.77-2.7.77-2.08 0-3.84-1.4-4.47-3.29H1.84v2.07A8 8 0 008.98 17z" />
    <path fill="#FBBC05" d="M4.51 10.53A4.8 4.8 0 014.26 9c0-.53.09-1.04.25-1.53V5.4H1.84A8 8 0 001 9c0 1.29.31 2.5.84 3.6l2.67-2.07z" />
    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.84 5.4L4.5 7.47c.63-1.89 2.4-3.29 4.48-3.29z" />
  </svg>
);

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, loading }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f0f2f5] to-[#e8edf5]">
      <div className="bg-white p-10 max-w-sm w-full text-center rounded-[20px] border border-[#e8eaed] shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
          <span className="text-2xl">📅</span>
        </div>
        <h1 className="text-2xl font-bold mb-1 tracking-tight text-gray-800">Lịch Rảnh</h1>
        <p className="text-sm text-gray-400 mb-8">Đăng nhập để tick lịch rảnh với nhóm</p>
        <button
          onClick={onLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập bằng Google'}
        </button>
      </div>
    </div>
  );
};
