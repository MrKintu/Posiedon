'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChromePicker, ColorResult } from 'react-color';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside of the color picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (color: ColorResult) => {
    onChange(color.hex);
  };

  return (
    <div className="relative" ref={pickerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded border dark:border-gray-600 shadow-sm"
          style={{ backgroundColor: color }}
          aria-label="Open color picker"
        />
        <input
          type="text"
          value={color}
          readOnly
          className="bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2">
          <div className="shadow-lg rounded-lg overflow-hidden">
            <ChromePicker
              color={color}
              onChange={handleChange}
              disableAlpha
              styles={{
                default: {
                  picker: {
                    backgroundColor: 'var(--background)',
                    color: 'var(--text)',
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
