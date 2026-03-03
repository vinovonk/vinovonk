"use client";

import { ButtonGroup } from "./button-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { WsetWineTasting, WijnType } from "@/types/wset-wine";
import {
  helderheidOpties,
  intensiteitDrieOpties,
  kleurWitOpties,
  kleurRoséOpties,
  kleurRoodOpties,
} from "@/data/wset-wine-options";

interface Props {
  data: WsetWineTasting["uiterlijk"];
  wijnType: WijnType;
  onChange: (data: WsetWineTasting["uiterlijk"]) => void;
}

export function WsetAppearance({ data, wijnType, onChange }: Props) {
  const kleurOpties =
    wijnType === "wit" || wijnType === "mousserend" || wijnType === "versterkt"
      ? kleurWitOpties
      : wijnType === "rosé"
        ? kleurRoséOpties
        : kleurRoodOpties;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-2">Appearance</h3>
        <p className="text-base text-muted-foreground">
          Beoordeel het visuele aspect van de wijn
        </p>
      </div>

      <ButtonGroup
        label="Clarity"
        opties={helderheidOpties}
        waarde={data.helderheid}
        onChange={(v) => onChange({ ...data, helderheid: v })}
      />

      <ButtonGroup
        label="Intensity"
        opties={intensiteitDrieOpties}
        waarde={data.intensiteit}
        onChange={(v) => onChange({ ...data, intensiteit: v })}
      />

      <ButtonGroup
        label="Colour"
        opties={kleurOpties}
        waarde={data.kleur}
        onChange={(v) => onChange({ ...data, kleur: v })}
        showColor
      />

      <div className="space-y-2">
        <Label htmlFor="overig">Other observations</Label>
        <Textarea
          id="overig"
          placeholder="Legs/tears, pétillance, deposit..."
          value={data.overig || ""}
          onChange={(e) => onChange({ ...data, overig: e.target.value })}
          rows={2}
          className="text-sm"
        />
      </div>
    </div>
  );
}
