"use client";

import { type ReactNode } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-card bg-surface p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-xl leading-none text-ink-faint hover:text-ink"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
