import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { collection, query, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './config/firebase';
import { useScheduleStore } from './store/useScheduleStore';
import { LoginScreen } from './features/auth/LoginScreen';
import { EmbeddedBrowserBlockedScreen } from './features/auth/EmbeddedBrowserBlockedScreen';
import { MainLayout } from './layouts/MainLayout';
import { getEmbeddedBrowserContext, openCurrentUrlInChrome, openCurrentUrlInExternalBrowser } from './utils/browser';
import type { UserSchedule } from './types';

function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loginLoading, setLoginLoading] = useState(false);
  const [authInitializing, setAuthInitializing] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [authBlockedContext] = useState(() => getEmbeddedBrowserContext());

  const { setMySlots, setAllSchedules, setBookedSlots, setFixed, setSyncing } = useScheduleStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthInitializing(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'schedules'));
    const unsubSchedules = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserSchedule));
      setAllSchedules(docs);
      
      const mine = docs.find((d) => d.id === user.uid);
      if (mine) {
        setMySlots(mine.slots || []);
        setFixed(!!mine.fixed);
      }
    });

    const unsubBooking = onSnapshot(doc(db, 'court', 'global'), (d) => {
      if (d.exists() && d.data().slots) {
        setBookedSlots(d.data().slots);
      } else {
        setBookedSlots({});
      }
    });

    return () => {
      unsubSchedules();
      unsubBooking();
    };
  }, [user, setAllSchedules, setMySlots, setFixed, setBookedSlots]);

  const login = async () => {
    if (authBlockedContext.isEmbedded) return;
    setLoginLoading(true);
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (e) {
      console.error('Login error:', e);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setMySlots([]);
    setAllSchedules([]);
    setBookedSlots({});
  };

  const onSaveSchedule = async (slots: string[], fixedVal: boolean) => {
    if (!user) return;
    setSyncing(true);
    try {
      await setDoc(doc(db, 'schedules', user.uid), {
        slots,
        fixed: fixedVal,
        name: user.displayName,
        photo: user.photoURL,
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.error('Save schedule error:', e);
    } finally {
      setSyncing(false);
    }
  };

  const onSaveBookings = async ({ newSelection, deleteSelection, selectedCourt }: { newSelection: Set<string>; deleteSelection: Set<string>; selectedCourt: string }) => {
    if (!user) return;
    setSyncing(true);
    try {
      const currentBooked = useScheduleStore.getState().bookedSlots;
      const next = { ...currentBooked };
      deleteSelection.forEach(key => delete next[key]);
      newSelection.forEach(key => {
        next[key] = { court: selectedCourt, user: user.displayName || 'Unknown' };
      });
      await setDoc(doc(db, 'court', 'global'), { slots: next });
    } catch (e) {
      console.error('Save bookings error:', e);
    } finally {
      setSyncing(false);
    }
  };

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyFeedback('Đã sao chép link');
    } catch (e) {
      console.error('Copy failed', e);
      setCopyFeedback('Không copy được');
    }
    window.setTimeout(() => setCopyFeedback(''), 2500);
  };

  if (user === undefined || authInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-gray-200 border-t-[#04BADE] rounded-full animate-spin" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (!user && authBlockedContext.isEmbedded) {
    return (
      <EmbeddedBrowserBlockedScreen
        blockedContext={authBlockedContext}
        onOpenInChrome={openCurrentUrlInChrome}
        onOpenInExternalBrowser={openCurrentUrlInExternalBrowser}
        onCopyLink={copyCurrentUrl}
        copyFeedback={copyFeedback}
      />
    );
  }

  if (!user) {
    return <LoginScreen onLogin={login} loading={loginLoading} />;
  }

  return (
    <MainLayout
      user={user}
      onLogout={handleLogout}
      onSaveSchedule={onSaveSchedule}
      onSaveBookings={onSaveBookings}
    />
  );
}

export default App;
