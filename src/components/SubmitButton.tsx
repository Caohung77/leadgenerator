import React from 'react';
import { Send, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-indigo-600 text-white rounded-lg py-2.5 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin h-5 w-5" />
          <span>Wird verarbeitet...</span>
        </>
      ) : (
        <>
          <Send className="h-5 w-5" />
          <span>Anfrage senden</span>
        </>
      )}
    </button>
  );
}