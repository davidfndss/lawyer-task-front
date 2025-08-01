"use client";

import React from "react";

interface OptionSelectorProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (val: T) => void;
  error?: string;
  getLabel?: (val: T) => string;

  baseClass?: string;
  activeClass?: string;
  inactiveClass?: string;
  iconClass?: string;
}

export default function OptionSelector<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
  getLabel = (val) => val.toUpperCase(),
  baseClass = "pr-4 pl-3 py-1 rounded-full text-sm border transition flex gap-2 items-center",
  activeClass = "bg-c4 text-white border-c4",
  inactiveClass = "bg-zinc-800 text-zinc-300 border-zinc-700 opacity-30 hover:opacity-100",
  iconClass = "bi bi-circle-fill text-zinc-50 text-[9px] mt-[2px] opacity-40",
}: OptionSelectorProps<T>) {
  return (
    <div>
      <label className="text-sm text-zinc-300 mb-1 block">{label}</label>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`${baseClass} ${
              value === option ? activeClass : inactiveClass
            }`}
          >
            <i className={iconClass}></i>
            <span>{getLabel(option)}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}