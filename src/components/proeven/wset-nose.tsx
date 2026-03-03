"use client";

import { ButtonGroup } from "./button-group";
import { AromaPicker } from "./aroma-picker";
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
