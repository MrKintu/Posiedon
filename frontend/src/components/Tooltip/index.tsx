'use client';

import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number | [number, number];
  disabled?: boolean;
  className?: string;
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = [100, 0],
  disabled = false,
  className = '',
}: TooltipProps) {
  if (disabled) {
    return children;
  }

  return (
    <Tippy
      content={content}
      placement={placement}
      delay={delay}
      animation="shift-away"
      className={`bg-gray-900 dark:bg-gray-700 text-white px-2 py-1 text-sm rounded shadow-lg ${className}`}
      arrow={false}
      duration={200}
    >
      {children}
    </Tippy>
  );
}

// Compound components for different tooltip variants
Tooltip.Success = (props: Omit<TooltipProps, 'className'>) => (
  <Tooltip {...props} className="bg-green-600 dark:bg-green-700" />
);

Tooltip.Error = (props: Omit<TooltipProps, 'className'>) => (
  <Tooltip {...props} className="bg-red-600 dark:bg-red-700" />
);

Tooltip.Warning = (props: Omit<TooltipProps, 'className'>) => (
  <Tooltip {...props} className="bg-yellow-600 dark:bg-yellow-700" />
);

Tooltip.Info = (props: Omit<TooltipProps, 'className'>) => (
  <Tooltip {...props} className="bg-blue-600 dark:bg-blue-700" />
);
