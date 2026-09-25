// PWA Service to handle Chrome 'beforeinstallprompt', iOS detection, and app installation
import confetti from 'canvas-confetti';

let deferredPrompt = null;
const listeners = new Set();

const isStandalone = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
};

const isIOSDevice = () => {
  if (typeof window === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !window.MSStream
  );
};

let state = {
  isInstallable: false,
  isInstalled: isStandalone(),
  isIOS: isIOSDevice(),
  hasPrompted: false
};

const notify = () => {
  listeners.forEach((listener) => listener(state));
};

if (typeof window !== 'undefined') {
  // Listen for Chrome / Android beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default mini-infobar on mobile Chrome
    e.preventDefault();
    deferredPrompt = e;
    state = {
      ...state,
      isInstallable: true,
      isInstalled: false
    };
    console.log('[PWA] Chrome beforeinstallprompt event captured and ready.');
    notify();
  });

  // Listen for successful installation
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    state = {
      ...state,
      isInstallable: false,
      isInstalled: true
    };
    console.log('[PWA] Application successfully installed on home screen!');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    notify();
  });
}

export const subscribePWAState = (listener) => {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
};

export const getPWAState = () => state;

export const triggerPWAInstall = async () => {
  if (state.isInstalled) {
    return { outcome: 'already_installed' };
  }

  // 1. Chrome / Edge / Opera / Android native install prompt
  if (deferredPrompt) {
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      console.log('[PWA] User install choice:', choiceResult.outcome);

      if (choiceResult.outcome === 'accepted') {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}
        state = { ...state, isInstallable: false, isInstalled: true };
      }
      deferredPrompt = null;
      notify();
      return { outcome: choiceResult.outcome };
    } catch (err) {
      console.error('[PWA] Install prompt failed:', err);
      return { outcome: 'error', error: err };
    }
  }

  // 2. iOS Safari fallback
  if (state.isIOS) {
    return { outcome: 'ios_instructions' };
  }

  // 3. Fallback when browser does not support or already in standalone
  return { outcome: 'manual_instructions' };
};
