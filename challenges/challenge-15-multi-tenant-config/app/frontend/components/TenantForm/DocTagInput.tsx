"use client";

import { useState, useRef, useEffect } from "react";
import { INSURANCE_DOCS } from "@mtc/shared";

type Props = {
  value: string[];
  onChange: (docs: string[]) => void;
  placeholder?: string;
};

export function DocTagInput({ value, onChange, placeholder = "Search documents…" }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = INSURANCE_DOCS.filter(
    (d) => !value.includes(d.key) && d.label.toLowerCase().includes(query.toLowerCase())
  );

  const add = (key: string) => {
    onChange([...value, key]);
    setQuery("");
  };

  const remove = (key: string) => {
    onChange(value.filter((v) => v !== key));
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const labelFor = (key: string) =>
    INSURANCE_DOCS.find((d) => d.key === key)?.label ?? key;

  return (
    <div ref={containerRef} className="relative">
      <div className="min-h-9 flex flex-wrap gap-1.5 items-center rounded-md border border-gray-300 px-2 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
        {value.map((key) => (
          <span
            key={key}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium"
          >
            {labelFor(key)}
            <button
              type="button"
              onClick={() => remove(key)}
              className="hover:text-blue-600 leading-none"
              aria-label={`Remove ${labelFor(key)}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-24 text-sm outline-none bg-transparent placeholder-gray-400"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg text-sm">
          {suggestions.map((d) => (
            <li
              key={d.key}
              onMouseDown={(e) => { e.preventDefault(); add(d.key); setOpen(false); }}
              className="px-3 py-2 cursor-pointer hover:bg-blue-50 hover:text-blue-700"
            >
              {d.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
