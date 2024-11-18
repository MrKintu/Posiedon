'use client';

import { registerLicense } from '@syncfusion/ej2-base';
import { ReactNode, useEffect } from 'react';

const SYNCFUSION_LICENSE_KEY = process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY;

interface SyncfusionProviderProps {
  children: ReactNode;
}

export function SyncfusionProvider({ children }: SyncfusionProviderProps) {
  useEffect(() => {
    if (!SYNCFUSION_LICENSE_KEY) {
      console.warn('Syncfusion license key not found in environment variables');
      return;
    }

    try {
      registerLicense(SYNCFUSION_LICENSE_KEY);
    } catch (error) {
      console.error('Failed to register Syncfusion license:', error);
    }
  }, []);

  return <>{children}</>;
}
