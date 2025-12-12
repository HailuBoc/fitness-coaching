'use client';

// PWA Install Button Component
import { Download } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function PWAInstallButton() {
  const { installPrompt, isInstalled, installApp } = usePWA();

  if (isInstalled || !installPrompt) {
    return null;
  }

  return (
    <button
      onClick={installApp}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Download className="w-5 h-5" />
      Install App
    </button>
  );
}

