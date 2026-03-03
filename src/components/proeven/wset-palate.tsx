"use client";

import { ButtonGroup } from "./button-group";
import { AromaPicker } from "./aroma-picker";
import type { WsetWineTasting, WijnType } from "@/types/wset-wine";
import {
  zoetheidOpties,
  schaalVijfOpties,
  bodyOpties,
  intensiteitVijfOpties,
  afdronkLengteOpties,
  mousseOpties,
} from "@/data/wset-wine-options";
import { Separator } from "@/components/ui/separator";

interface Props {
  data: WsetWineTasting["gehemelte"];
  wijnType: WijnType;
  onChange: (data: WsetWineTasting["gehemelte"]) => void;
}

export function WsetPalate({ data, wijnType, onChange }: Props) {
  const toonTannine = wijnType === "rood" || wijnType === "versterkt";
  const toonMousse = wijnType === "mousserend";

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-2">Palate</h3>
        <p className="text-base text-muted-foreground">
          Beoordeel de smaak en structuur van de wijn
        </p>
      </div>

      <ButtonGroup
        label="Sweetness"
        opties={zoetheidOpties}
        waarde={data.zoetheid}
        onChange={(v) => onChange({ ...data, zoetheid: v })}
        size="sm"
      />

      <ButtonGroup
        label="Acidity"
        opties={schaalVijfOpties}
        waarde={data.zuurgraad}
        onChange={(v) => onChange({ ...data, zuurgraad: v })}
      />

      {toonTannine && (
        <ButtonGroup
          label="Tannin"
          opties={schaalVijfOpties}
          waarde={data.tannine}
          onChange={(v) => onChange({ ...data, tannine: v })}
        />
      )}

      {toonMousse && (
        <ButtonGroup
          label="Mousse"
          opties={mousseOpties}
          waarde={data.mousseIntensiteit}
          onChange={(v) => onChange({ ...data, mousseIntensiteit: v })}
        />
      )}

      <ButtonGroup
        label="Alcohol"
        opties={schaalVijfOpties}
        waarde={data.alcohol}
        onChange={(v) => onChange({ ...data, alcohol: v })}
      />

      <ButtonGroup
        label="Body"
        opties={bodyOpties}
        waarde={data.body}
        onChange={(v) => onChange({ ...data, body: v })}
      />

      <ButtonGroup
        label="Flavour intensity"
        opties={intensiteitVijfOpties}
        waarde={data.smaakIntensiteit}
        onChange={(v) => onChange({ ...data, smaakIntensiteit: v })}
      />

      <Separator />

      <div>
        <h4 className="text-sm font-semibold mb-3">Flavour characteristics</h4>
      </div>

      <AromaPicker
        primair={data.smaakKenmerken.primair}
        secundair={data.smaakKenmerken.secundair}
        tertiair={data.smaakKenmerken.tertiair}
        onPrimairChange={(aromas) =>
          onChange({
            ...data,
            smaakKenmerken: { ...data.smaakKenmerken, primair: aromas },
          })
        }
        onSecundairChange={(aromas) =>
          onChange({
            ...data,
            smaakKenmerken: { ...data.smaakKenmerken, secundair: aromas },
          })
        }
        onTertiairChange={(aromas) =>
          onChange({
            ...data,
            smaakKenmerken: { ...data.smaakKenmerken, tertiair: aromas },
          })
        }
      />

      <Separator />

      <div>
        <h4 className="text-sm font-semibold mb-3">Finish</h4>
        <div className="space-y-4">
          <ButtonGroup
            label="Length"
            opties={afdronkLengteOpties}
            waarde={data.afdronk.lengte}
            onChange={(v) =>
              onChange({ ...data, afdronk: { ...data.afdronk, lengte: v } })
            }
          />
        </div>
      </div>
    </div>
  );
}
