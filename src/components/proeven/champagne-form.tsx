"use client";

import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ButtonGroup } from "@/components/proeven/button-group";
import { X, Eye, Flower2, UtensilsCrossed, Award, FileText, ChevronRight, Link2, Link2Off } from "lucide-react";
import { WsetDetails } from "@/components/proeven/wset-details";
import { AutocompleteInput } from "@/components/proeven/autocomplete-input";
import { toast } from "sonner";
import type { ChampagneTasting } from "@/types/champagne";
import { createEmptyChampagneTasting } from "@/types/champagne";
import {
  cuveeTypeOpties, stijlOpties, dosageOpties,
  producerTypeOpties, classificatieOpties, champagneDruivenRassen,
  zoekChampagneProducenten, zoekChampagneVillages,
  champagneKleurOpties, belGrootteOpties, belPersistentieOpties,
  mousseKwaliteitOpties, champagneHelderheidOpties,
  champagneIntensiteitOpties, autolytischKarakterOpties, oxidatiefKarakterOpties,
  champagneAromaCategorieen,
  champagneAanvalOpties, champagneZoetheidOpties, champagneZuurgraadOpties,
  champagneBodyOpties, champagneAfdronkOpties, champagneComplexiteitOpties,
  champagneKwaliteitOpties, champagneDrinkbaarheidOpties,
} from "@/data/champagne-options";

export interface ChampagneFormHandle {
  getData: () => ChampagneTasting;
  mergeAIData: (aiData: Partial<ChampagneTasting>) => void;
}

interface ChampagneFormProps {
  initialData?: ChampagneTasting;
  persoonlijkeNotitie?: string;
  score?: number;
  onSave: (data: ChampagneTasting, notitie?: string, score?: number) => void;
  fase?: 'info' | 'proeven';
}

// Small inline aroma picker component
function AromaPicker({
  geselecteerd,
  onChange,
  neusAromas,
}: {
  geselecteerd: string[];
  onChange: (aromas: string[]) => void;
  neusAromas?: string[]; // referentie-aromas van neus (optioneel)
}) {
  const [customInput, setCustomInput] = useState("");

  const toggle = (aroma: string) => {
    if (geselecteerd.includes(aroma)) {
      onChange(geselecteerd.filter((a) => a !== aroma));
    } else {
      onChange([...geselecteerd, aroma]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !geselecteerd.includes(trimmed)) {
      onChange([...geselecteerd, trimmed]);
    }
    setCustomInput("");
  };

  // Bereken overlap voor visueel verschil
  const neusSet = new Set(neusAromas ?? []);
  const gedeeld = geselecteerd.filter((a) => neusSet.has(a));
  const alleenPalate = geselecteerd.filter((a) => !neusSet.has(a));
  const neusNietGeproefd = (neusAromas ?? []).filter((a) => !geselecteerd.includes(a));

  return (
    <div className="space-y-4">
      {/* Neus-referentie sectie: toon neus-aromas bovenaan als snelkoppeling */}
      {neusAromas && neusAromas.length > 0 && (
        <div className="space-y-2 pb-3 border-b border-dashed">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Van neus</p>
          <div className="flex flex-wrap gap-2">
            {neusAromas.map((aroma) => (
              <Badge
                key={aroma}
                variant={geselecteerd.includes(aroma) ? "default" : "outline"}
                className={`cursor-pointer select-none text-sm px-3 py-1.5 min-h-[36px] flex items-center transition-opacity ${
                  !geselecteerd.includes(aroma) ? "opacity-40 border-dashed" : ""
                }`}
                onClick={() => toggle(aroma)}
              >
                {aroma}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Hoofdcategorieën */}
      {champagneAromaCategorieen.map((cat) => (
        <div key={cat.categorie} className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{cat.categorie}</p>
          <div className="flex flex-wrap gap-2">
            {cat.aromas.map((aroma) => (
              <Badge
                key={aroma}
                variant={geselecteerd.includes(aroma) ? "default" : "outline"}
                className="cursor-pointer select-none text-sm px-3 py-1.5 min-h-[36px] flex items-center"
                onClick={() => toggle(aroma)}
              >
                {aroma}
              </Badge>
            ))}
          </div>
        </div>
      ))}

      {/* Geselecteerde samenvatting met visueel verschil (alleen wanneer neusAromas beschikbaar) */}
      {geselecteerd.length > 0 && (
        <div className="pt-2 border-t space-y-2">
          {neusAromas ? (
            <>
              {gedeeld.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Neus & mondgevoel ({gedeeld.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {gedeeld.map((aroma) => (
                      <Badge key={aroma} variant="secondary" className="gap-1.5 text-sm px-2.5 py-1">
                        {aroma}
                        <button type="button" onClick={() => toggle(aroma)} className="min-w-6 min-h-6 flex items-center justify-center hover:opacity-70">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {alleenPalate.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Alleen mondgevoel ({alleenPalate.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {alleenPalate.map((aroma) => (
                      <Badge key={aroma} variant="outline" className="gap-1.5 text-sm px-2.5 py-1 border-primary/60 text-primary">
                        {aroma}
                        <button type="button" onClick={() => toggle(aroma)} className="min-w-6 min-h-6 flex items-center justify-center hover:opacity-70">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {neusNietGeproefd.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Geroken, niet geproefd</p>
                  <div className="flex flex-wrap gap-2">
                    {neusNietGeproefd.map((aroma) => (
                      <Badge
                        key={aroma}
                        variant="outline"
                        className="gap-1.5 text-sm px-2.5 py-1 opacity-40 border-dashed cursor-pointer"
                        onClick={() => toggle(aroma)}
                      >
                        {aroma}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Selected ({geselecteerd.length})</p>
              <div className="flex flex-wrap gap-2">
                {geselecteerd.map((aroma) => (
                  <Badge key={aroma} variant="secondary" className="gap-1.5 text-sm px-2.5 py-1">
                    {aroma}
                    <button type="button" onClick={() => toggle(aroma)} className="min-w-6 min-h-6 flex items-center justify-center hover:opacity-70">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Eigen aroma toevoegen */}
      <div className="flex gap-2">
        <Input
          placeholder="Add custom aroma..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
          className="h-10 text-base"
        />
        <Button type="button" variant="outline" size="sm" onClick={addCustom} className="h-10 px-4">
          Add
        </Button>
      </div>
    </div>
  );
}

// Grape variety quick-select
function DruivenRassenInput({
  druiven,
  onChange,
}: {
  druiven: string[];
  onChange: (druiven: string[]) => void;
}) {
  const [customInput, setCustomInput] = useState("");

  const toggle = (ras: string) => {
    if (druiven.includes(ras)) {
      onChange(druiven.filter((d) => d !== ras));
    } else {
      onChange([...druiven, ras]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !druiven.includes(trimmed)) {
      onChange([...druiven, trimmed]);
    }
    setCustomInput("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {champagneDruivenRassen.map((ras) => (
          <Badge
            key={ras}
            variant={druiven.includes(ras) ? "default" : "outline"}
            className="cursor-pointer select-none text-sm px-3 py-1.5 min-h-[36px] flex items-center"
            onClick={() => toggle(ras)}
          >
            {ras}
          </Badge>
        ))}
      </div>
      {druiven.filter((d) => !champagneDruivenRassen.includes(d)).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {druiven
            .filter((d) => !champagneDruivenRassen.includes(d))
            .map((ras) => (
              <Badge key={ras} variant="secondary" className="gap-1.5 text-sm px-2.5 py-1">
                {ras}
                <button type="button" onClick={() => toggle(ras)} className="min-w-6 min-h-6 flex items-center justify-center hover:opacity-70 rounded-sm focus-visible:ring-2 focus-visible:ring-ring">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          placeholder="Other variety..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
          className="h-10 text-base"
        />
        <Button type="button" variant="outline" size="sm" onClick={addCustom} className="h-10 px-4">
          Add
        </Button>
      </div>
    </div>
  );
}

export const ChampagneForm = forwardRef<ChampagneFormHandle, ChampagneFormProps>(
  function ChampagneForm(
    { initialData, persoonlijkeNotitie: initNotitie, score: initScore, onSave, fase = 'info' },
    ref
  ) {
    const [data, setData] = useState<ChampagneTasting>(
      initialData ?? createEmptyChampagneTasting()
    );
    const [notitie, setNotitie] = useState(initNotitie ?? "");
    const [score, setScore] = useState<number | undefined>(initScore);
    const [activeTab, setActiveTab] = useState("visueel");
    const [neusSync, setNeusSync] = useState(true);
    const tabsRef = useRef<HTMLDivElement>(null);

    // Auto-vul mondgevoel aroma's vanuit neus wanneer je de tab opent (eenmalig)
    useEffect(() => {
      if (
        activeTab === "mondgevoel" &&
        neusSync &&
        data.neus.aromas.length > 0 &&
        data.mondgevoel.smaakAromas.length === 0
      ) {
        setData((prev) => ({
          ...prev,
          mondgevoel: { ...prev.mondgevoel, smaakAromas: [...prev.neus.aromas] },
        }));
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    useImperativeHandle(ref, () => ({
      getData: () => data,
      mergeAIData: (aiData: Partial<ChampagneTasting>) => {
        setData((prev) => ({
          ...prev,
          ...aiData,
          visueel: { ...prev.visueel, ...(aiData.visueel ?? {}) },
          neus: { ...prev.neus, ...(aiData.neus ?? {}) },
          mondgevoel: { ...prev.mondgevoel, ...(aiData.mondgevoel ?? {}) },
          conclusie: { ...prev.conclusie, ...(aiData.conclusie ?? {}) },
        }));
      },
    }), [data]);

    const champagneTabLabels: Record<string, string> = {
      visueel: 'Appearance',
      neus: 'Nose',
      mondgevoel: 'Palate',
      conclusie: 'Conclusions',
    };

    const navigateToMissing = (missing: { label: string; tab: string }[]) => {
      if (missing.length === 0) return;
      const firstTab = missing[0].tab;
      setActiveTab(firstTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSave = () => {
      // Validate required fields in proeven fase
      if (fase === 'proeven') {
        const missing: { label: string; tab: string }[] = [];
        if (!data.visueel.kleur) missing.push({ label: "Colour", tab: "visueel" });
        if (!data.visueel.belGrootte) missing.push({ label: "Bubble size", tab: "visueel" });
        if (!data.visueel.mousse) missing.push({ label: "Mousse", tab: "visueel" });
        if (!data.neus.intensiteit) missing.push({ label: "Intensity", tab: "neus" });
        if (!data.neus.autolytischKarakter) missing.push({ label: "Autolytic character", tab: "neus" });
        if (!data.mondgevoel.zoetheid) missing.push({ label: "Sweetness", tab: "mondgevoel" });
        if (!data.mondgevoel.zuurgraad) missing.push({ label: "Acidity", tab: "mondgevoel" });
        if (!data.mondgevoel.afdronkLengte) missing.push({ label: "Finish length", tab: "mondgevoel" });
        if (!data.conclusie.kwaliteit) missing.push({ label: "Quality level", tab: "conclusie" });

        if (missing.length > 0) {
          const count = missing.length;
          const perTab = missing.reduce<Record<string, string[]>>((acc, m) => {
            if (!acc[m.tab]) acc[m.tab] = [];
            acc[m.tab].push(m.label);
            return acc;
          }, {});
          const firstTab = missing[0].tab;
          const tabNaam = champagneTabLabels[firstTab] || firstTab;

          toast.warning(
            `Nog ${count} veld${count > 1 ? 'en' : ''} in te vullen`,
            {
              description: Object.entries(perTab)
                .map(([tab, labels]) => `${champagneTabLabels[tab]}: ${labels.join(', ')}`)
                .join(' · '),
              duration: 8000,
              action: {
                label: `Ga naar ${tabNaam}`,
                onClick: () => navigateToMissing(missing),
              },
            }
          );
          // Automatisch naar eerste ontbrekende tab navigeren
          navigateToMissing(missing);
          return;
        }
      }

      onSave(data, notitie || undefined, score);
    };

    // === INFO FASE ===
    if (fase === 'info') {
      return (
        <div className="space-y-6">
          {/* Cuvée naam */}
          <div className="space-y-2">
            <Label htmlFor="cuveeNaam" className="text-base font-medium">Cuvée name *</Label>
            <Input
              id="cuveeNaam"
              placeholder="e.g. Blanc de Blancs, Brut Réserve, La Grande Dame..."
              value={data.cuveeNaam}
              onChange={(e) => setData({ ...data, cuveeNaam: e.target.value })}
              className="h-11 text-base"
              autoFocus
            />
          </div>

          {/* Producent */}
          <div className="space-y-2">
            <Label htmlFor="producent" className="text-base font-medium">Producer / Maison</Label>
            <AutocompleteInput
              id="producent"
              placeholder="e.g. Moët & Chandon, Krug, Billecart-Salmon..."
              value={data.producent ?? ""}
              onChange={(value) => setData({ ...data, producent: value })}
              suggesties={zoekChampagneProducenten(data.producent ?? "")}
              className="h-11 text-base"
            />
          </div>

          {/* Regio */}
          <div className="space-y-2">
            <Label htmlFor="regio" className="text-base font-medium">Village / Regio</Label>
            <AutocompleteInput
              id="regio"
              placeholder="e.g. Épernay, Aÿ, Le Mesnil-sur-Oger, Reims..."
              value={data.regio ?? ""}
              onChange={(value) => setData({ ...data, regio: value })}
              suggesties={zoekChampagneVillages(data.regio ?? "")}
              className="h-11 text-base"
            />
          </div>

          {/* Cuvée type */}
          <ButtonGroup
            label="Cuvée type"
            opties={cuveeTypeOpties}
            waarde={data.cuveeType}
            onChange={(v) => setData({ ...data, cuveeType: v })}
            size="sm"
          />

          {/* Jaargang (alleen millésimé) */}
          {(data.cuveeType === 'millesime' || data.cuveeType === 'prestige') && (
            <div className="space-y-2">
              <Label htmlFor="jaargang" className="text-base font-medium">Vintage year</Label>
              <Input
                id="jaargang"
                type="number"
                placeholder="e.g. 2015"
                value={data.jaargang ?? ""}
                onChange={(e) => setData({ ...data, jaargang: e.target.value ? Number(e.target.value) : undefined })}
                className="h-11 text-base"
              />
            </div>
          )}

          {/* Stijl */}
          <ButtonGroup
            label="Style"
            opties={stijlOpties}
            waarde={data.stijl}
            onChange={(v) => setData({ ...data, stijl: v })}
            size="sm"
          />

          {/* Dosage */}
          <ButtonGroup
            label="Dosage"
            opties={dosageOpties}
            waarde={data.dosage}
            onChange={(v) => setData({ ...data, dosage: v })}
            size="sm"
          />

          {/* Dosage g/L — exact getal van de fles */}
          <div className="space-y-2">
            <Label htmlFor="dosageGl" className="text-base font-medium">
              Dosage g/L <span className="text-muted-foreground font-normal">(optioneel — van de fles)</span>
            </Label>
            <div className="relative">
              <Input
                id="dosageGl"
                type="number"
                min={0}
                max={200}
                step={0.5}
                placeholder="bijv. 6"
                value={data.dosageGl ?? ""}
                onChange={(e) => setData({ ...data, dosageGl: e.target.value ? Number(e.target.value) : undefined })}
                className="h-11 text-base pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">g/L</span>
            </div>
          </div>

          {/* Druivenrassen */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Grape varieties</Label>
            <DruivenRassenInput
              druiven={data.druivenrassen}
              onChange={(druiven) => setData({ ...data, druivenrassen: druiven })}
            />
          </div>

          {/* Producer type */}
          <ButtonGroup
            label="Producer type"
            opties={producerTypeOpties}
            waarde={data.producerType}
            onChange={(v) => setData({ ...data, producerType: v })}
            size="sm"
          />

          {/* Classificatie */}
          <ButtonGroup
            label="Classification"
            opties={classificatieOpties}
            waarde={data.classificatie}
            onChange={(v) => setData({ ...data, classificatie: v })}
            size="sm"
          />

          {/* Disgorgement datum */}
          <div className="space-y-2">
            <Label htmlFor="disgorgeerdatum" className="text-base font-medium">
              Disgorgement date <span className="text-muted-foreground font-normal">(optioneel)</span>
            </Label>
            <Input
              id="disgorgeerdatum"
              type="date"
              value={data.disgorgeerdatum ?? ""}
              onChange={(e) => setData({ ...data, disgorgeerdatum: e.target.value })}
              className="h-11 text-base"
            />
          </div>

        </div>
      );
    }

    // === PROEVEN FASE ===
    return (
      <div className="space-y-4" ref={tabsRef}>
        <Tabs value={activeTab} onValueChange={(tab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full">
          <TabsList className="!w-full !flex !h-14 p-1.5 bg-muted/50 border border-border gap-1.5">
            <TabsTrigger
              value="visueel"
              className="flex-1 text-base gap-2 h-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 transition-all"
            >
              <Eye className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">Appearance</span>
            </TabsTrigger>
            <TabsTrigger
              value="neus"
              className="flex-1 text-base gap-2 h-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 transition-all"
            >
              <Flower2 className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">Nose</span>
            </TabsTrigger>
            <TabsTrigger
              value="mondgevoel"
              className="flex-1 text-base gap-2 h-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 transition-all"
            >
              <UtensilsCrossed className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">Palate</span>
            </TabsTrigger>
            <TabsTrigger
              value="conclusie"
              className="flex-1 text-base gap-2 h-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 transition-all"
            >
              <Award className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">Conclusions</span>
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="flex-1 text-base gap-2 h-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 transition-all"
            >
              <FileText className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">Details</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
          {/* === TAB 1: VISUEEL === */}
          <TabsContent value="visueel" className="space-y-6">
            <ButtonGroup
              label="Colour"
              opties={champagneKleurOpties}
              waarde={data.visueel.kleur}
              onChange={(v) => setData({ ...data, visueel: { ...data.visueel, kleur: v } })}
              showColor
            />
            <ButtonGroup
              label="Bubble size"
              opties={belGrootteOpties}
              waarde={data.visueel.belGrootte}
              onChange={(v) => setData({ ...data, visueel: { ...data.visueel, belGrootte: v } })}
            />
            <ButtonGroup
              label="Bubble persistence"
              opties={belPersistentieOpties}
              waarde={data.visueel.belPersistentie}
              onChange={(v) => setData({ ...data, visueel: { ...data.visueel, belPersistentie: v } })}
            />
            <ButtonGroup
              label="Mousse quality"
              opties={mousseKwaliteitOpties}
              waarde={data.visueel.mousse}
              onChange={(v) => setData({ ...data, visueel: { ...data.visueel, mousse: v } })}
            />
            <ButtonGroup
              label="Clarity"
              opties={champagneHelderheidOpties}
              waarde={data.visueel.helderheid}
              onChange={(v) => setData({ ...data, visueel: { ...data.visueel, helderheid: v } })}
            />
            <div className="space-y-2">
              <Label className="text-base font-medium">Other observations</Label>
              <Textarea
                placeholder="Deposit, rim colour variation, viscosity..."
                value={data.visueel.overig ?? ""}
                onChange={(e) => setData({ ...data, visueel: { ...data.visueel, overig: e.target.value } })}
                rows={2}
              />
            </div>

            <Button
              type="button"
              className="w-full h-12 text-base"
              onClick={() => setActiveTab("neus")}
            >
              Next — Nose
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TabsContent>

          {/* === TAB 2: NEUS === */}
          <TabsContent value="neus" className="space-y-6">
            {/* Vibe — persoonlijke eerste indruk */}
            <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4 space-y-2">
              <label className="text-base font-medium text-foreground italic">
                Vibe — what does it remind you of?
              </label>
              <p className="text-sm text-muted-foreground">
                Your personal first impression, in any language
              </p>
              <Textarea
                placeholder="toasted brioche, lemon curd, fresh-baked croissants, sea breeze..."
                value={data.neus.vibe || ""}
                onChange={(e) => setData({ ...data, neus: { ...data.neus, vibe: e.target.value } })}
                rows={2}
                className="text-base bg-background/60 placeholder:italic border-primary/10 focus-visible:ring-primary/30"
              />
            </div>

            <ButtonGroup
              label="Intensity"
              opties={champagneIntensiteitOpties}
              waarde={data.neus.intensiteit}
              onChange={(v) => setData({ ...data, neus: { ...data.neus, intensiteit: v } })}
            />
            <ButtonGroup
              label="Autolytic character"
              opties={autolytischKarakterOpties}
              waarde={data.neus.autolytischKarakter}
              onChange={(v) => setData({ ...data, neus: { ...data.neus, autolytischKarakter: v } })}
            />
            <ButtonGroup
              label="Oxidative character"
              opties={oxidatiefKarakterOpties}
              waarde={data.neus.oxidatiefKarakter}
              onChange={(v) => setData({ ...data, neus: { ...data.neus, oxidatiefKarakter: v } })}
            />
            <div className="space-y-2">
              <Label className="text-base font-medium">Aroma characteristics</Label>
              <AromaPicker
                geselecteerd={data.neus.aromas}
                onChange={(aromas) => setData({ ...data, neus: { ...data.neus, aromas } })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-medium">Other observations</Label>
              <Textarea
                placeholder="Additional nose notes..."
                value={data.neus.overig ?? ""}
                onChange={(e) => setData({ ...data, neus: { ...data.neus, overig: e.target.value } })}
                rows={2}
              />
            </div>

            <Button
              type="button"
              className="w-full h-12 text-base"
              onClick={() => setActiveTab("mondgevoel")}
            >
              Next — Palate
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TabsContent>

          {/* === TAB 3: MONDGEVOEL === */}
          <TabsContent value="mondgevoel" className="space-y-6">
            <ButtonGroup
              label="Mousse on palate"
              opties={mousseKwaliteitOpties}
              waarde={data.mondgevoel.mousse}
              onChange={(v) => setData({ ...data, mondgevoel: { ...data.mondgevoel, mousse: v } })}
            />
            <ButtonGroup
              label="Attack"
              opties={champagneAanvalOpties}
              waarde={data.mondgevoel.aanval}
              onChange={(v) => setData({ ...data, mondgevoel: { ...data.mondgevoel, aanval: v } })}
            />
            <ButtonGroup
              label="Sweetness / dosage perception"
              opties={champagneZoetheidOpties}
              waarde={data.mondgevoel.zoetheid}
              onChange={(v) => setData({ ...data, mondgevoel: { ...data.mondgevoel, zoetheid: v } })}
              size="sm"
            />
            <ButtonGroup
              label="Acidity"
              opties={champagneZuurgraadOpties}
              waarde={data.mondgevoel.zuurgraad}
              onChange={(v) => setData({ ...data, mondgevoel: { ...data.mondgevoel, zuurgraad: v } })}
            />
            <ButtonGroup
              label="Body"
              opties={champagneBodyOpties}
              waarde={data.mondgevoel.body}
              onChange={(v) => setData({ ...data, mondgevoel: { ...data.mondgevoel, body: v } })}
            />
            <ButtonGroup
              label="Flavour intensity"
              opties={champagneIntensiteitOpties}
              waarde={data.mondgevoel.smaakIntensiteit}
              onChange={(v) => setData({ ...data, mondgevoel: { ...data.mondgevoel, smaakIntensiteit: v } })}
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Flavour characteristics</Label>
                {data.neus.aromas.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!neusSync) {
                        // Zet sync aan: kopieer neus aromas naar mondgevoel
                        setData((prev) => ({
                          ...prev,
                          mondgevoel: { ...prev.mondgevoel, smaakAromas: [...prev.neus.aromas] },
                        }));
                      }
                      setNeusSync((v) => !v);
                    }}
                    className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-colors ${
                      neusSync
                        ? "text-primary bg-primary/10 hover:bg-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {neusSync ? (
                      <><Link2 className="h-3 w-3" /> Gekoppeld aan neus</>
                    ) : (
                      <><Link2Off className="h-3 w-3" /> Koppelen aan neus</>
                    )}
                  </button>
                )}
              </div>
              <AromaPicker
                geselecteerd={data.mondgevoel.smaakAromas}
                onChange={(aromas) => setData({ ...data, mondgevoel: { ...data.mondgevoel, smaakAromas: aromas } })}
                neusAromas={neusSync || data.neus.aromas.length > 0 ? data.neus.aromas : undefined}
              />
            </div>
            <ButtonGroup
              label="Finish length"
              opties={champagneAfdronkOpties}
              waarde={data.mondgevoel.afdronkLengte}
              onChange={(v) => setData({ ...data, mondgevoel: { ...data.mondgevoel, afdronkLengte: v } })}
            />
            <ButtonGroup
              label="Complexity"
              opties={champagneComplexiteitOpties}
              waarde={data.mondgevoel.complexiteit}
              onChange={(v) => setData({ ...data, mondgevoel: { ...data.mondgevoel, complexiteit: v } })}
            />
            <div className="space-y-2">
              <Label className="text-base font-medium">Other observations</Label>
              <Textarea
                placeholder="Texture, balance, after-taste notes..."
                value={data.mondgevoel.overig ?? ""}
                onChange={(e) => setData({ ...data, mondgevoel: { ...data.mondgevoel, overig: e.target.value } })}
                rows={2}
              />
            </div>

            <Button
              type="button"
              className="w-full h-12 text-base"
              onClick={() => setActiveTab("conclusie")}
            >
              Next — Conclusions
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TabsContent>

          {/* === TAB 4: CONCLUSIE === */}
          <TabsContent value="conclusie" className="space-y-6">
            {/* Kwaliteit */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Quality level</Label>
              <div className="space-y-2">
                {champagneKwaliteitOpties.map((opt) => (
                  <button
                    key={opt.waarde}
                    type="button"
                    onClick={() => setData({ ...data, conclusie: { ...data.conclusie, kwaliteit: opt.waarde } })}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      data.conclusie.kwaliteit === opt.waarde
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className={`text-sm mt-0.5 ${data.conclusie.kwaliteit === opt.waarde ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {opt.beschrijving}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Drinkbaarheid */}
            <ButtonGroup
              label="Readiness for drinking"
              opties={champagneDrinkbaarheidOpties}
              waarde={data.conclusie.drinkbaarheid}
              onChange={(v) => setData({ ...data, conclusie: { ...data.conclusie, drinkbaarheid: v } })}
              size="sm"
            />

            {/* Rijpingspotentieel */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Ageing potential <span className="text-muted-foreground font-normal">(optioneel)</span>
              </Label>
              <Input
                placeholder="e.g. 5–10 years, drink 2025–2030..."
                value={data.conclusie.rijpingspotentieel ?? ""}
                onChange={(e) => setData({ ...data, conclusie: { ...data.conclusie, rijpingspotentieel: e.target.value } })}
                className="h-11 text-base"
              />
            </div>

            {/* Food pairing */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Food pairing <span className="text-muted-foreground font-normal">(optioneel)</span>
              </Label>
              <Input
                placeholder="e.g. oysters, lobster, aged Comté..."
                value={data.conclusie.voedselparing ?? ""}
                onChange={(e) => setData({ ...data, conclusie: { ...data.conclusie, voedselparing: e.target.value } })}
                className="h-11 text-base"
              />
            </div>

            {/* Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Score</Label>
                {score !== undefined ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">{score}<span className="text-base font-normal text-muted-foreground">/10</span></span>
                    <button
                      type="button"
                      onClick={() => setScore(undefined)}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Verwijderen
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setScore(7)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Score toevoegen
                  </button>
                )}
              </div>
              {score !== undefined && (
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[score]}
                  onValueChange={([v]) => setScore(v)}
                  className="w-full"
                />
              )}
            </div>

            {/* Persoonlijke notitie */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Personal notes</Label>
              <Textarea
                placeholder="Your personal observations, context, purchase reason..."
                value={notitie}
                onChange={(e) => setNotitie(e.target.value)}
                rows={4}
              />
            </div>

            {/* Opslaan */}
            <Button
              type="button"
              onClick={handleSave}
              className="w-full h-12 text-base"
            >
              Save tasting note
            </Button>
          </TabsContent>

          {/* === TAB 5: DETAILS === */}
          <TabsContent value="details">
            <WsetDetails
              data={data.details}
              onChange={(details) => setData({ ...data, details })}
              drankNaam="champagne"
            />
          </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  }
);
