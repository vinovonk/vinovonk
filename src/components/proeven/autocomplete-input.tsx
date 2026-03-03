"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";

interface AutocompleteInputProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  suggesties: string[];
  className?: string;
}

export function AutocompleteInput({
  id,
  placeholder,
  value,
  onChange,
  suggesties,
  className,
}: AutocompleteInputProps) {
  const [showSuggesties, setShowSuggesties] = useState(false);
  const [geselecteerdeIndex, setGeselecteerdeIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && showSuggesties && suggesties.length > 0) {
      e.preventDefault();
      onChange(suggesties[geselecteerdeIndex]);
      setShowSuggesties(false);
    } else if (e.key === "ArrowDown" && showSuggesties) {
      e.preventDefault();
      setGeselecteerdeIndex((prev) =>
        prev < suggesties.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp" && showSuggesties) {
      e.preventDefault();
      setGeselecteerdeIndex((prev) =>
        prev > 0 ? prev - 1 : suggesties.length - 1
      );
    } else if (e.key === "Escape") {
      setShowSuggesties(false);
    }
  };

  return (
    <div className="relative">
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggesties(true);
          setGeselecteerdeIndex(0);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggesties(true)}
        onBlur={() => {
          // Vertraging om klik op suggestie te detecteren
          setTimeout(() => setShowSuggesties(false), 200);
        }}
        className={className}
      />

      {/* Autocomplete dropdown */}
      {showSuggesties && suggesties.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggesties.map((suggestie, index) => (
            <button
              key={suggestie}
              type="button"
              onClick={() => {
                onChange(suggestie);
                setShowSuggesties(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-base transition-colors ${
                index === geselecteerdeIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              }`}
            >
              {suggestie}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
