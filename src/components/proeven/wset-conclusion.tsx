"use client";

import { ButtonGroup } from "./button-group";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { WsetWineTasting } from "@/types/wset-wine";
import {
  kwaliteitOpties,
  drinkbaarheidOpties,
} from "@/data/wset-wine-options";

interface Props {
  data: WsetWineTasting["conclusie"];
  persoonlijkeNotitie?: string;
  score?: number;
  onChange: (data: WsetWineTasting["conclusie"]) => void;
  onNotitieChange: (notitie: string) => void;
  onScoreChange: (score: number | undefined) => void;
}

export function WsetConclusion({
  data,
  persoonlijkeNotitie,
  score,
  onChange,
  onNotitieChange,
  onScoreChange,
}: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-2">Conclusions</h3>
        <p className="text-base text-muted-foreground">
          Assessment of quality (BLIC: Balance, Length, Intensity, Complexity)
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" id="quality-level-label">Quality level</label>
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-labelledby="quality-level-label">
          {kwaliteitOpties.map((optie) => (
            <button
              key={optie.waarde}
              type="button"
              role="radio"
              aria-checked={data.kwaliteit === optie.waarde}
              onClick={() => onChange({ ...data, kwaliteit: optie.waarde })}
              className={`px-3 py-2 rounded-md border text-sm transition-all min-h-[44px] ${
                data.kwaliteit === optie.waarde
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20"
              }`}
              title={optie.beschrijving}
            >
              <div className="font-medium">{optie.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{optie.beschrijving}</div>
            </button>
          ))}
        </div>
      </div>

      <ButtonGroup
        label="Readiness for drinking / ageing potential"
        opties={drinkbaarheidOpties}
        waarde={data.drinkbaarheid}
        onChange={(v) => onChange({ ...data, drinkbaarheid: v })}
        size="sm"
      />

      {/* Score slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Score (optioneel)</Label>
          <span className="text-sm font-mono text-muted-foreground">
            {score !== undefined ? `${score}/10` : "—"}
          </span>
        </div>
        <Slider
          value={score !== undefined ? [score] : [7]}
          onValueChange={(v) => onScoreChange(v[0])}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
        {score !== undefined && (
          <button
            type="button"
            onClick={() => onScoreChange(undefined)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Score verwijderen
          </button>
        )}
      </div>

      {/* Persoonlijke notitie */}
      <div className="space-y-2">
        <Label htmlFor="notitie">Persoonlijke notitie</Label>
        <Textarea
          id="notitie"
          placeholder="Jouw persoonlijke opmerkingen, context, aankoopreden..."
          value={persoonlijkeNotitie || ""}
          onChange={(e) => onNotitieChange(e.target.value)}
          rows={4}
          className="text-sm"
        />
      </div>
    </div>
  );
}
