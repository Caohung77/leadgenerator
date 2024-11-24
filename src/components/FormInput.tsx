import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  Icon: LucideIcon;
}

export function FormInput({ id, label, type, value, onChange, placeholder, Icon }: FormInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          required
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className="pl-10 w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2 transition-colors"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}