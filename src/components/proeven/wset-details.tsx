"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ButtonGroup } from "./button-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import type {
  Herkomst,
  OpnieuwKopen,
  AanbevolenVoor,
  WsetWineTasting
} from "@/types/wset-wine";

interface WsetDetailsProps {
  data: WsetWineTasting["details"];
  onChange: (details: WsetWineTasting["details"]) => void;
}

const herkomstOpties = [
  { waarde: "gekocht" as Herkomst, label: "Gekocht" },
  { waarde: "pr_sample" as Herkomst, label: "PR Sample" },
  { waarde: "cadeau" as Herkomst, label: "Cadeau" },
  { waarde: "event" as Herkomst, label: "Event" },
  { waarde: "podcast" as Herkomst, label: "Podcast" },
];

const opnieuwKopenOpties = [
  { waarde: "ja" as OpnieuwKopen, label: "Ja" },
  { waarde: "misschien" as OpnieuwKopen, label: "Misschien" },
  { waarde: "nee" as OpnieuwKopen, label: "Nee" },
];

const aanbevolenVoorOpties: { waarde: AanbevolenVoor; label: string }[] = [
  { waarde: "beginners", label: "Beginners" },
  { waarde: "gevorderden", label: "Gevorderden" },
  { waarde: "feest", label: "Feest" },
  { waarde: "diner", label: "Diner" },
  { waarde: "cadeautip", label: "Cadeautip" },
];

export function WsetDetails({ data, onChange }: WsetDetailsProps) {
  if (!data) return null;

  const updateField = <K extends keyof NonNullable<WsetWineTasting["details"]>>(
    field: K,
    value: NonNullable<WsetWineTasting["details"]>[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const toggleAanbeveling = (waarde: AanbevolenVoor) => {
    const current = data.aanbevolenVoor || [];
    if (current.includes(waarde)) {
      updateField("aanbevolenVoor", current.filter((v) => v !== waarde));
    } else {
      updateField("aanbevolenVoor", [...current, waarde]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Herkomst & Verkoop */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">Herkomst & Verkoop</h3>
          <p className="text-base text-muted-foreground">
            Hoe ben je aan deze wijn gekomen en waar is deze te verkrijgen
          </p>
        </div>

        <ButtonGroup
          label="Hoe verkregen"
          opties={herkomstOpties}
          waarde={data.herkomst}
          onChange={(v) => updateField("herkomst", v)}
        />

        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
          <div className="space-y-0.5">
            <Label htmlFor="betaalde-samenwerking" className="text-base font-medium">
              Betaalde samenwerking
            </Label>
            <p className="text-sm text-muted-foreground">
              Is dit een commerciële samenwerking?
            </p>
          </div>
          <Switch
            id="betaalde-samenwerking"
            checked={data.betaaldeSamenwerking}
            onCheckedChange={(checked) => updateField("betaaldeSamenwerking", checked)}
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="waar-te-koop" className="text-base font-medium">
            Waar te koop
          </Label>
          <Input
            id="waar-te-koop"
            placeholder="Bijv. Gall & Gall, Albert Heijn, of directe link"
            value={data.waarTeKoop || ""}
            onChange={(e) => updateField("waarTeKoop", e.target.value)}
            className="text-base h-11"
          />
        </div>
      </div>

      {/* Proef Context */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">Proef Context</h3>
          <p className="text-base text-muted-foreground">
            Wanneer en in welke setting heb je deze wijn geproefd
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2.5">
            <Label htmlFor="proefdatum" className="text-base font-medium">
              Proef datum
            </Label>
            <Input
              id="proefdatum"
              type="date"
              value={data.proefdatum || ""}
              onChange={(e) => updateField("proefdatum", e.target.value)}
              className="text-base h-11"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="serveer-temp" className="text-base font-medium">
              Serveer temperatuur
            </Label>
            <Input
              id="serveer-temp"
              placeholder="Bijv. 16-18°C"
              value={data.serveerTemperatuur || ""}
              onChange={(e) => updateField("serveerTemperatuur", e.target.value)}
              className="text-base h-11"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="gerecht" className="text-base font-medium">
            Geproefd met (gerecht)
          </Label>
          <Input
            id="gerecht"
            placeholder="Bijv. Ossobuco, gegrilde entrecote, of puur"
            value={data.gerechtCombinatie || ""}
            onChange={(e) => updateField("gerechtCombinatie", e.target.value)}
            className="text-base h-11"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="personen" className="text-base font-medium">
            Geproefd met (personen)
          </Label>
          <Input
            id="personen"
            placeholder="Bijv. alleen, vrienden, of naam van event"
            value={data.geproefMetPersonen || ""}
            onChange={(e) => updateField("geproefMetPersonen", e.target.value)}
            className="text-base h-11"
          />
        </div>
      </div>

      {/* VinoVonk Content */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">VinoVonk Content</h3>
          <p className="text-base text-muted-foreground">
            Voor je blog en podcast publicaties
          </p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
          <div className="space-y-0.5">
            <Label htmlFor="sparks-podcast" className="text-base font-medium">
              Sparks by VinoVonk podcast
            </Label>
            <p className="text-sm text-muted-foreground">
              Komt deze wijn in de podcast?
            </p>
          </div>
          <Switch
            id="sparks-podcast"
            checked={data.sparksPodcast}
            onCheckedChange={(checked) => updateField("sparksPodcast", checked)}
          />
        </div>

        {data.sparksPodcast && (
          <div className="space-y-2.5">
            <Label htmlFor="podcast-aflevering" className="text-base font-medium">
              Podcast aflevering
            </Label>
            <Input
              id="podcast-aflevering"
              placeholder="Bijv. #42 of link naar aflevering"
              value={data.podcastAflevering || ""}
              onChange={(e) => updateField("podcastAflevering", e.target.value)}
              className="text-base h-11"
            />
          </div>
        )}

      </div>

      {/* Persoonlijke Beoordeling */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">Persoonlijke Beoordeling</h3>
          <p className="text-base text-muted-foreground">
            Jouw eigen mening en aanbevelingen
          </p>
        </div>

        <ButtonGroup
          label="Zou opnieuw kopen"
          opties={opnieuwKopenOpties}
          waarde={data.opnieuwKopen}
          onChange={(v) => updateField("opnieuwKopen", v)}
        />

        <div className="space-y-2.5">
          <Label className="text-base font-medium">Prijs-kwaliteit verhouding</Label>
          <div className="flex items-center gap-3">
            <StarRating
              value={data.prijsKwaliteitVerhouding || 0}
              onChange={(v) => updateField("prijsKwaliteitVerhouding", v === 0 ? null : v)}
              size="lg"
              showValue
            />
            {data.prijsKwaliteitVerhouding && (
              <button
                type="button"
                onClick={() => updateField("prijsKwaliteitVerhouding", null)}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          <Label className="text-base font-medium">Aanbevolen voor</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Selecteer meerdere als van toepassing
          </p>
          <div className="flex flex-wrap gap-2">
            {aanbevolenVoorOpties.map((optie) => {
              const isSelected = (data.aanbevolenVoor || []).includes(optie.waarde);
              return (
                <button
                  key={optie.waarde}
                  type="button"
                  onClick={() => toggleAanbeveling(optie.waarde)}
                  className={`px-4 py-2.5 rounded-md text-base font-medium transition-all min-h-[44px] border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20"
                  }`}
                >
                  {optie.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
