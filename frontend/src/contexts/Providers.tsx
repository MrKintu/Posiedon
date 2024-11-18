'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './AuthContext';
import { ContextProvider } from './ContextProvider';
import { GlobalErrorBoundary } from '@/components/ErrorBoundary';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const handleThemeChange = (theme: string | undefined) => {
    console.log('[Providers] Theme changed to:', theme);
  };

  return (
    <GlobalErrorBoundary>
      <ThemeProvider 
        attribute="class" 
        enableSystem={false} 
        defaultTheme="light"
        // TODO: Implement theme change handling
        themes={['light', 'dark']}
      >
        <AuthProvider>
          <ContextProvider>
            {children}
          </ContextProvider>
        </AuthProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
}
