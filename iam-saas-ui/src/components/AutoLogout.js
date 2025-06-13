// src/components/AutoLogout.js
import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AutoLogout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const inactivityTime = 10 * 60 * 1000; // 10 minutes

  // Memoize resetTimer to prevent re-creation on every render
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (user) {
        logout();
        navigate('/login', { replace: true });
        alert('Logged out due to inactivity.');
      }
    }, inactivityTime);
  }, [user, logout, navigate, inactivityTime]);

  useEffect(() => {
    resetTimer();
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  return null;
}
