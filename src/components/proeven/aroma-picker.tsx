"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Search, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  primaireAromas,
  secundaireAromas,
  tertiaireAromas,
  type AromaCategorie,
} from "@/data/aroma-lexicon";

interface AromaPickerProps {
  primair: string[];
  secundair: string[];
  tertiair: string[];
  onPrimairChange: (aromas: string[]) => void;
  onSecundairChange: (aromas: string[]) => void;
  onTertiairChange: (aromas: string[]) => void;
}

export function AromaPicker({
  primair,
  secundair,
  tertiair,
  onPrimairChange,
  onSecundairChange,
  onTertiairChange,
}: AromaPickerProps) {
  const [zoekterm, setZoekterm] = useState("");
  const [customAroma, setCustomAroma] = useState("");

  const alle = [...primair, ...secundair, ...tertiair];

  return (
    <div className="space-y-3">
      <label className="text-base font-medium text-foreground">
        Aroma &amp; flavour characteristics
      </label>

      {/* Geselecteerde aroma's als badges */}
      {alle.length > 0 && (
        <ScrollArea className="max-h-32">
          <div className="flex flex-wrap gap-2 pr-4">
            {primair.map((a) => (
              <Badge key={`p-${a}`} variant="default" className="gap-1 text-sm px-2.5 py-1.5">
                {a}
                <button
                  type="button"
                  onClick={() => onPrimairChange(primair.filter((x) => x !== a))}
                  className="p-0.5 rounded-sm hover:bg-primary-foreground/20 transition-colors"
                  aria-label={`${a} verwijderen`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            ))}
            {secundair.map((a) => (
              <Badge key={`s-${a}`} variant="secondary" className="gap-1 text-sm px-2.5 py-1.5">
                {a}
                <button
                  type="button"
                  onClick={() => onSecundairChange(secundair.filter((x) => x !== a))}
                  className="p-0.5 rounded-sm hover:bg-foreground/10 transition-colors"
                  aria-label={`${a} verwijderen`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            ))}
            {tertiair.map((a) => (
              <Badge key={`t-${a}`} variant="outline" className="gap-1 text-sm px-2.5 py-1.5">
                {a}
                <button
                  type="button"
                  onClick={() => onTertiairChange(tertiair.filter((x) => x !== a))}
                  className="p-0.5 rounded-sm hover:bg-foreground/10 transition-colors"
                  aria-label={`${a} verwijderen`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Zoekbalk */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search aroma..."
          value={zoekterm}
          onChange={(e) => setZoekterm(e.target.value)}
          className="pl-9 text-base h-11"
        />
      </div>

      {/* Primary / Secondary / Tertiary gestapeld */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Primary</p>
          <AromaLijst
            categorieen={primaireAromas}
            geselecteerd={primair}
            onChange={onPrimairChange}
            zoekterm={zoekterm}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Secondary</p>
          <AromaLijst
            categorieen={secundaireAromas}
            geselecteerd={secundair}
            onChange={onSecundairChange}
            zoekterm={zoekterm}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tertiary</p>
          <AromaLijst
            categorieen={tertiaireAromas}
            geselecteerd={tertiair}
            onChange={onTertiairChange}
            zoekterm={zoekterm}
          />
        </div>
      </div>

      {/* Add custom aroma */}
      <div className="flex gap-2">
        <Input
          placeholder="Add custom aroma..."
          value={customAroma}
          onChange={(e) => setCustomAroma(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && customAroma.trim()) {
              onPrimairChange([...primair, customAroma.trim()]);
              setCustomAroma("");
            }
          }}
          className="text-base h-11"
        />
        <button
          type="button"
          onClick={() => {
            if (customAroma.trim()) {
              onPrimairChange([...primair, customAroma.trim()]);
              setCustomAroma("");
            }
          }}
          className="px-3 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors min-h-[44px]"
          aria-label="Aroma toevoegen"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Subcomponent: Aroma lijst per type
function AromaLijst({
  categorieen,
  geselecteerd,
  onChange,
  zoekterm,
}: {
  categorieen: AromaCategorie[];
  geselecteerd: string[];
  onChange: (aromas: string[]) => void;
  zoekterm: string;
}) {
  const toggle = (aroma: string) => {
    if (geselecteerd.includes(aroma)) {
      onChange(geselecteerd.filter((a) => a !== aroma));
    } else {
      onChange([...geselecteerd, aroma]);
    }
  };

  const term = zoekterm.toLowerCase();

  return (
    <div className="rounded-md border p-3 bg-muted/30">
      {categorieen.map((cat) => {
        const filteredSubs = cat.subcategorieen
          .map((sub) => ({
            ...sub,
            aromas: sub.aromas.filter((a) =>
              term ? a.toLowerCase().includes(term) : true
            ),
          }))
          .filter((sub) => sub.aromas.length > 0);

        if (filteredSubs.length === 0) return null;

        return (
          <div key={cat.categorie} className="mb-4 last:mb-0">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {cat.categorie}
            </h4>
            {filteredSubs.map((sub) => (
              <div key={sub.naam} className="mb-3 last:mb-0">
                <p className="text-sm text-muted-foreground mb-1.5">{sub.naam}</p>
                <div className="flex flex-wrap gap-1.5">
                  {sub.aromas.map((aroma) => (
                    <button
                      key={aroma}
                      type="button"
                      onClick={() => toggle(aroma)}
                      className={`px-3 py-2 rounded-md text-base transition-all min-h-[44px] font-medium ${
                        geselecteerd.includes(aroma)
                          ? "bg-primary text-primary-foreground border border-primary shadow-sm"
                          : "bg-background text-foreground border border-border hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20"
                      }`}
                    >
                      {aroma}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
