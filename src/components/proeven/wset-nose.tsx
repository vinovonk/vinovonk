"use client";

import { ButtonGroup } from "./button-group";
import { AromaPicker } from "./aroma-picker";
import { Textarea } from "@/components/ui/textarea";
import type { WsetWineTasting } from "@/types/wset-wine";
import {
  conditieOpties,
  intensiteitVijfOpties,
  ontwikkelingOpties,
} from "@/data/wset-wine-options";

interface Props {
  data: WsetWineTasting["neus"];
  onChange: (data: WsetWineTasting["neus"]) => void;
}

export function WsetNose({ data, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-2">Nose</h3>
        <p className="text-base text-muted-foreground">
          Beoordeel de geur van de wijn
        </p>
      </div>

      {/* Vibe — persoonlijke eerste indruk */}
      <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4 space-y-2">
        <label className="text-base font-medium text-foreground italic">
          Vibe — what does it remind you of?
        </label>
        <p className="text-sm text-muted-foreground">
          Your personal first impression, in any language
        </p>
        <Textarea
          placeholder="warm apple pie with whipped cream, grandmother's garden, fresh brioche..."
          value={data.vibe || ""}
          onChange={(e) => onChange({ ...data, vibe: e.target.value })}
          rows={2}
          className="text-base bg-background/60 placeholder:italic border-primary/10 focus-visible:ring-primary/30"
        />
      </div>

      <ButtonGroup
        label="Condition"
        opties={conditieOpties}
        waarde={data.conditie}
        onChange={(v) => onChange({ ...data, conditie: v })}
      />

      <ButtonGroup
        label="Intensity"
        opties={intensiteitVijfOpties}
        waarde={data.intensiteit}
        onChange={(v) => onChange({ ...data, intensiteit: v })}
      />

      <AromaPicker
        primair={data.aromaKenmerken.primair}
        secundair={data.aromaKenmerken.secundair}
        tertiair={data.aromaKenmerken.tertiair}
        onPrimairChange={(aromas) =>
          onChange({
            ...data,
            aromaKenmerken: { ...data.aromaKenmerken, primair: aromas },
          })
        }
        onSecundairChange={(aromas) =>
          onChange({
            ...data,
            aromaKenmerken: { ...data.aromaKenmerken, secundair: aromas },
          })
        }
        onTertiairChange={(aromas) =>
          onChange({
            ...data,
            aromaKenmerken: { ...data.aromaKenmerken, tertiair: aromas },
          })
        }
      />

      <ButtonGroup
        label="Development"
        opties={ontwikkelingOpties}
        waarde={data.ontwikkeling}
        onChange={(v) => onChange({ ...data, ontwikkeling: v })}
      />
    </div>
  );
}
