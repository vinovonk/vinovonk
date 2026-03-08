"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { getSuggesties } from "@/data/druiven-database";
import type { WijnType } from "@/types/wset-wine";

interface DruivenInputProps {
  druiven: string[];
  onChange: (druiven: string[]) => void;
  wijnType: WijnType;
  land?: string;
  regio?: string;
}

export function DruivenInput({ druiven, onChange, wijnType, land, regio }: DruivenInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggesties, setShowSuggesties] = useState(false);
  const [geselecteerdeIndex, setGeselecteerdeIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggesties = getSuggesties(wijnType, land, inputValue, regio);

  const voegDruifToe = (druif: string) => {
    const trimmed = druif.trim();
    if (trimmed && !druiven.includes(trimmed)) {
      onChange([...druiven, trimmed]);
    }
    setInputValue("");
    setShowSuggesties(false);
    setGeselecteerdeIndex(0);
  };

  const verwijderDruif = (index: number) => {
    onChange(druiven.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (showSuggesties && suggesties.length > 0) {
        voegDruifToe(suggesties[geselecteerdeIndex].naam);
      } else if (inputValue.trim()) {
        voegDruifToe(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && druiven.length > 0) {
      // Backspace op lege input verwijdert laatste druif
      verwijderDruif(druiven.length - 1);
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

  useEffect(() => {
    setGeselecteerdeIndex(0);
  }, [inputValue]);

  return (
    <div className="relative">
      <div className="space-y-3">
        {/* Geselecteerde druiven als badges */}
        {druiven.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {druiven.map((druif, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="gap-1.5 text-sm px-2.5 py-1"
              >
                {druif}
                <button
                  type="button"
                  onClick={() => verwijderDruif(index)}
                  className="hover:bg-muted rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Input veld */}
        <Input
          ref={inputRef}
          placeholder={
            druiven.length === 0
              ? "Typ om te zoeken of voeg druif toe..."
              : "Voeg nog een druif toe..."
          }
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggesties(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggesties(true)}
          onBlur={() => {
            // Vertraging om klik op suggestie te detecteren
            setTimeout(() => setShowSuggesties(false), 200);
          }}
          role="combobox"
          aria-expanded={showSuggesties && suggesties.length > 0}
          aria-controls="druiven-listbox"
          aria-autocomplete="list"
          aria-activedescendant={
            showSuggesties && suggesties.length > 0
              ? `druif-option-${geselecteerdeIndex}`
              : undefined
          }
          className="text-base h-11"
        />
      </div>

      {/* Autocomplete suggesties dropdown */}
      {showSuggesties && suggesties.length > 0 && (
        <div
          id="druiven-listbox"
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggesties.slice(0, 10).map((druif, index) => (
            <button
              key={druif.naam}
              id={`druif-option-${index}`}
              type="button"
              role="option"
              aria-selected={index === geselecteerdeIndex}
              onClick={() => voegDruifToe(druif.naam)}
              className={`w-full text-left px-4 py-2.5 text-base transition-colors ${
                index === geselecteerdeIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              }`}
            >
              <div className="font-medium">{druif.naam}</div>
              {land && druif.landen.includes(land) && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  Populair in {land}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Helper text */}
      <p className="text-sm text-muted-foreground mt-2">
        Typ om te zoeken in populaire druiven, of voer een eigen naam in en druk op Enter
      </p>
    </div>
  );
}
