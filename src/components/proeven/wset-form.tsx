"use client";

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonGroup } from "./button-group";
import { WsetAppearance } from "./wset-appearance";
import { WsetNose } from "./wset-nose";
import { WsetPalate } from "./wset-palate";
import { WsetConclusion } from "./wset-conclusion";
import { WsetDetails } from "./wset-details";
import { DruivenInput } from "./druiven-input";
import { AutocompleteInput } from "./autocomplete-input";
import { wijnTypeOpties } from "@/data/wset-wine-options";
import { zoekLanden, zoekRegios } from "@/data/wijn-regio-database";
import type { WsetWineTasting, WijnType, AromaKenmerken } from "@/types/wset-wine";
import { createEmptyWineTasting } from "@/types/wset-wine";
import { Eye, Flower2, UtensilsCrossed, Award, Save, Mic, FileText } from "lucide-react";
import { toast } from "sonner";

export interface WsetFormHandle {
  mergeAIData: (aiData: Partial<WsetWineTasting>) => void;
  getData: () => WsetWineTasting;
}

interface WsetFormProps {
  initialData?: WsetWineTasting;
  persoonlijkeNotitie?: string;
  score?: number;
  onSave: (data: WsetWineTasting, notitie?: string, score?: number) => void;
  onStartRecording?: () => void;
  isRecording?: boolean;
  fase?: 'info' | 'proeven';
}

// Merge aroma's: voeg AI-aroma's toe aan bestaande, zonder duplicaten
function mergeAromas(existing: AromaKenmerken, incoming: AromaKenmerken): AromaKenmerken {
  const unique = (arr1: string[], arr2: string[]) =>
    [...new Set([...arr1, ...arr2])];
  return {
    primair: unique(existing.primair, incoming.primair),
    secundair: unique(existing.secundair, incoming.secundair),
    tertiair: unique(existing.tertiair, incoming.tertiair),
  };
}

// Deep merge: AI-data overschrijft alleen null/lege velden, aroma's worden samengevoegd
function deepMergeWsetData(
  current: WsetWineTasting,
  ai: Partial<WsetWineTasting>
): WsetWineTasting {
  const merged = { ...current };

  // Top-level string velden: alleen vullen als leeg
  if (ai.wijnNaam && !current.wijnNaam) merged.wijnNaam = ai.wijnNaam;
  if (ai.producent && !current.producent) merged.producent = ai.producent;
  if (ai.regio && !current.regio) merged.regio = ai.regio;
  if (ai.land && !current.land) merged.land = ai.land;
  if (ai.jaargang && !current.jaargang) merged.jaargang = ai.jaargang;
  if (ai.prijs && !current.prijs) merged.prijs = ai.prijs;
  if (ai.druivenras && (!current.druivenras || current.druivenras.length === 0))
    merged.druivenras = ai.druivenras;
  if (ai.wijnType) merged.wijnType = ai.wijnType;

  // Uiterlijk
  if (ai.uiterlijk) {
    merged.uiterlijk = {
      helderheid: current.uiterlijk.helderheid || ai.uiterlijk.helderheid || null,
      intensiteit: current.uiterlijk.intensiteit || ai.uiterlijk.intensiteit || null,
      kleur: current.uiterlijk.kleur || ai.uiterlijk.kleur || null,
      overig: current.uiterlijk.overig || ai.uiterlijk.overig,
    };
  }

  // Neus
  if (ai.neus) {
    merged.neus = {
      conditie: current.neus.conditie || ai.neus.conditie || null,
      intensiteit: current.neus.intensiteit || ai.neus.intensiteit || null,
      aromaKenmerken: ai.neus.aromaKenmerken
        ? mergeAromas(current.neus.aromaKenmerken, ai.neus.aromaKenmerken)
        : current.neus.aromaKenmerken,
      ontwikkeling: current.neus.ontwikkeling || ai.neus.ontwikkeling || null,
    };
  }

  // Gehemelte
  if (ai.gehemelte) {
    merged.gehemelte = {
      zoetheid: current.gehemelte.zoetheid || ai.gehemelte.zoetheid || null,
      zuurgraad: current.gehemelte.zuurgraad || ai.gehemelte.zuurgraad || null,
      tannine: current.gehemelte.tannine || ai.gehemelte.tannine || null,
      mousseIntensiteit: current.gehemelte.mousseIntensiteit || ai.gehemelte.mousseIntensiteit || null,
      alcohol: current.gehemelte.alcohol || ai.gehemelte.alcohol || null,
      body: current.gehemelte.body || ai.gehemelte.body || null,
      smaakIntensiteit: current.gehemelte.smaakIntensiteit || ai.gehemelte.smaakIntensiteit || null,
      smaakKenmerken: ai.gehemelte.smaakKenmerken
        ? mergeAromas(current.gehemelte.smaakKenmerken, ai.gehemelte.smaakKenmerken)
        : current.gehemelte.smaakKenmerken,
      afdronk: {
        lengte: current.gehemelte.afdronk.lengte || ai.gehemelte.afdronk?.lengte || null,
        complexiteit: current.gehemelte.afdronk.complexiteit || ai.gehemelte.afdronk?.complexiteit || null,
      },
    };
  }

  // Conclusie
  if (ai.conclusie) {
    merged.conclusie = {
      kwaliteit: current.conclusie.kwaliteit || ai.conclusie.kwaliteit || null,
      drinkbaarheid: current.conclusie.drinkbaarheid || ai.conclusie.drinkbaarheid || null,
      rijpingspotentieel: current.conclusie.rijpingspotentieel || ai.conclusie.rijpingspotentieel || null,
    };
  }

  return merged;
}

export const WsetForm = forwardRef<WsetFormHandle, WsetFormProps>(function WsetForm({
  initialData,
  persoonlijkeNotitie: initialNotitie,
  score: initialScore,
  onSave,
  onStartRecording,
  isRecording,
  fase,
}, ref) {
  const [data, setData] = useState<WsetWineTasting>(
    initialData || createEmptyWineTasting()
  );

  // Expose merge functie aan parent component via ref
  useImperativeHandle(ref, () => ({
    mergeAIData: (aiData: Partial<WsetWineTasting>) => {
      setData((current) => deepMergeWsetData(current, aiData));
    },
    getData: () => data,
  }), [data]);
  const [notitie, setNotitie] = useState(initialNotitie || "");
  const [score, setScore] = useState<number | undefined>(initialScore);
  const [activeTab, setActiveTab] = useState("appearance");

  const handleWijnTypeChange = (type: WijnType) => {
    setData({
      ...data,
      wijnType: type,
      uiterlijk: { ...data.uiterlijk, kleur: null }, // Reset kleur bij type wissel
    });
  };

  const validateRequiredFields = (): { isValid: boolean; missing: string[] } => {
    const missing: string[] = [];

    // Appearance - all required
    if (!data.uiterlijk.helderheid) missing.push('Appearance → Clarity');
    if (!data.uiterlijk.intensiteit) missing.push('Appearance → Intensity');
    if (!data.uiterlijk.kleur) missing.push('Appearance → Colour');

    // Nose - all required
    if (!data.neus.conditie) missing.push('Nose → Condition');
    if (!data.neus.intensiteit) missing.push('Nose → Intensity');
    if (!data.neus.ontwikkeling) missing.push('Nose → Development');

    // Palate - essential fields only
    if (!data.gehemelte.zoetheid) missing.push('Palate → Sweetness');
    if (!data.gehemelte.zuurgraad) missing.push('Palate → Acidity');
    if (!data.gehemelte.alcohol) missing.push('Palate → Alcohol');
    if (!data.gehemelte.body) missing.push('Palate → Body');
    if (!data.gehemelte.smaakIntensiteit) missing.push('Palate → Flavour intensity');
    if (!data.gehemelte.afdronk.lengte) missing.push('Palate → Finish (Length)');

    // Conclusions - all required
    if (!data.conclusie.kwaliteit) missing.push('Conclusions → Quality level');
    if (!data.conclusie.drinkbaarheid) missing.push('Conclusions → Readiness for drinking');

    return { isValid: missing.length === 0, missing };
  };

  const handleSave = () => {
    const validation = validateRequiredFields();
    if (!validation.isValid) {
      const count = validation.missing.length;
      toast.error(
        `Vul nog ${count} verplicht${count > 1 ? 'e velden' : ' veld'} in: ${validation.missing.slice(0, 3).join(', ')}${count > 3 ? ` en nog ${count - 3}...` : ''}`,
        { duration: 6000 }
      );
      return;
    }

    onSave(data, notitie, score);
  };

  // Tel ingevulde velden per sectie (voor voortgangsindicatie)
  const countAppearance = [data.uiterlijk.helderheid, data.uiterlijk.intensiteit, data.uiterlijk.kleur].filter(Boolean).length;
  const countNose = [data.neus.conditie, data.neus.intensiteit, data.neus.ontwikkeling].filter(Boolean).length + (data.neus.aromaKenmerken.primair.length > 0 ? 1 : 0);
  const countPalate = [data.gehemelte.zoetheid, data.gehemelte.zuurgraad, data.gehemelte.alcohol, data.gehemelte.body, data.gehemelte.smaakIntensiteit, data.gehemelte.afdronk.lengte].filter(Boolean).length;
  const countConclusion = [data.conclusie.kwaliteit, data.conclusie.drinkbaarheid, data.conclusie.rijpingspotentieel].filter(Boolean).length;
  const countDetails = data.details ? [
    data.details.herkomst,
    data.details.opnieuwKopen,
    data.details.prijsKwaliteitVerhouding,
  ].filter(Boolean).length : 0;

  const toonInfo = !fase || fase === 'info';
  const toonProeven = !fase || fase === 'proeven';

  return (
    <div className="space-y-6">
      {/* Wijn metadata — alleen zichtbaar in info-fase */}
      {toonInfo && <Card>
        <CardContent className="pt-6 space-y-4">
          <ButtonGroup
            label="Type wijn"
            opties={wijnTypeOpties}
            waarde={data.wijnType}
            onChange={handleWijnTypeChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="land">Land</Label>
              <AutocompleteInput
                id="land"
                placeholder="Bijv. Frankrijk, Italië, Spanje..."
                value={data.land || ""}
                onChange={(value) => setData({ ...data, land: value })}
                suggesties={zoekLanden(data.land || "")}
                className="text-base h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regio">Regio</Label>
              <AutocompleteInput
                id="regio"
                placeholder={data.land ? `Bijv. regio in ${data.land}...` : "Kies eerst een land"}
                value={data.regio || ""}
                onChange={(value) => setData({ ...data, regio: value })}
                suggesties={zoekRegios(data.land, data.regio || "")}
                className="text-base h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wijnNaam">Naam</Label>
              <Input
                id="wijnNaam"
                placeholder="Bijv. Châteauneuf-du-Pape 2019"
                value={data.wijnNaam}
                onChange={(e) => setData({ ...data, wijnNaam: e.target.value })}
                className="text-base h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="producent">Producent</Label>
              <Input
                id="producent"
                placeholder="Bijv. Domaine du Vieux Télégraphe"
                value={data.producent || ""}
                onChange={(e) => setData({ ...data, producent: e.target.value })}
                className="text-base h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jaargang">
                Jaargang {data.wijnType === 'mousserend' && <span className="text-xs text-muted-foreground">(of NV)</span>}
              </Label>
              {data.wijnType === 'mousserend' ? (
                <div className="flex gap-2">
                  <Input
                    id="jaargang"
                    type="text"
                    placeholder="2019 of NV"
                    value={data.jaargang === 0 ? 'NV' : data.jaargang || ""}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      if (val === 'NV' || val === 'N') {
                        setData({ ...data, jaargang: 0 });
                      } else {
                        setData({ ...data, jaargang: parseInt(val) || undefined });
                      }
                    }}
                    className="text-base h-11"
                  />
                  {data.jaargang !== 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setData({ ...data, jaargang: 0 })}
                      className="h-11 px-4 whitespace-nowrap"
                    >
                      NV
                    </Button>
                  )}
                </div>
              ) : (
                <Input
                  id="jaargang"
                  type="number"
                  placeholder="2019"
                  value={data.jaargang || ""}
                  onChange={(e) => setData({ ...data, jaargang: parseInt(e.target.value) || undefined })}
                  className="text-base h-11"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prijs">Prijs (€)</Label>
              <Input
                id="prijs"
                type="number"
                step="0.01"
                placeholder="25.00"
                value={data.prijs || ""}
                onChange={(e) => setData({ ...data, prijs: parseFloat(e.target.value) || undefined })}
                className="text-base h-11"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="druivenras">Druivenras(sen)</Label>
            <DruivenInput
              druiven={data.druivenras || []}
              onChange={(druiven) => setData({ ...data, druivenras: druiven })}
              wijnType={data.wijnType}
              land={data.land}
              regio={data.regio}
            />
          </div>
        </CardContent>
      </Card>}

      {/* AI opname knop — alleen zichtbaar in info-fase */}
      {toonInfo && onStartRecording && (
        <Button
          type="button"
          variant={isRecording ? "destructive" : "outline"}
          onClick={onStartRecording}
          className="w-full"
          size="lg"
        >
          <Mic className="h-5 w-5 mr-2" />
          {isRecording
            ? "Opname stoppen"
            : "Inspreken (AI vult formulier in)"}
        </Button>
      )}

      {/* WSET Tabs — alleen zichtbaar in proeven-fase */}
      {toonProeven && <>
      <Tabs value={activeTab} onValueChange={(tab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full">
        <TabsList className="!w-full !flex !h-14 p-1.5 bg-muted/50 border border-border gap-1.5">
          <TabsTrigger
            value="appearance"
            className="flex-1 text-base gap-2 h-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 transition-all"
          >
            <Eye className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">Appearance</span>
            {countAppearance > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center font-semibold">
                {countAppearance}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="nose"
            className="flex-1 text-base gap-2 h-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 transition-all"
          >
            <Flower2 className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">Nose</span>
            {countNose > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center font-semibold">
                {countNose}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="palate"
            className="flex-1 text-base gap-2 h-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 transition-all"
          >
            <UtensilsCrossed className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">Palate</span>
            {countPalate > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center font-semibold">
                {countPalate}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="conclusions"
            className="flex-1 text-base gap-2 h-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 transition-all"
          >
            <Award className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">Conclusions</span>
            {countConclusion > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center font-semibold">
                {countConclusion}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="flex-1 text-base gap-2 h-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 transition-all"
          >
            <FileText className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">Details</span>
            {countDetails > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center font-semibold">
                {countDetails}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="appearance">
            <WsetAppearance
              data={data.uiterlijk}
              wijnType={data.wijnType}
              onChange={(uiterlijk) => setData({ ...data, uiterlijk })}
            />
          </TabsContent>

          <TabsContent value="nose">
            <WsetNose
              data={data.neus}
              onChange={(neus) => setData({ ...data, neus })}
            />
          </TabsContent>

          <TabsContent value="palate">
            <WsetPalate
              data={data.gehemelte}
              wijnType={data.wijnType}
              onChange={(gehemelte) => setData({ ...data, gehemelte })}
            />
          </TabsContent>

          <TabsContent value="conclusions">
            <WsetConclusion
              data={data.conclusie}
              persoonlijkeNotitie={notitie}
              score={score}
              onChange={(conclusie) => setData({ ...data, conclusie })}
              onNotitieChange={setNotitie}
              onScoreChange={setScore}
            />
          </TabsContent>

          <TabsContent value="details">
            <WsetDetails
              data={data.details}
              onChange={(details) => setData({ ...data, details })}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Navigation */}
      <div className="flex gap-3">
        {activeTab !== "appearance" && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const tabs = ["appearance", "nose", "palate", "conclusions", "details"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex > 0) { setActiveTab(tabs[currentIndex - 1]); window.scrollTo({ top: 0, behavior: 'smooth' }); }
            }}
            className="flex-1 h-12 text-base"
          >
            Vorige
          </Button>
        )}
        {activeTab !== "details" ? (
          <Button
            type="button"
            onClick={() => {
              const tabs = ["appearance", "nose", "palate", "conclusions", "details"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex < tabs.length - 1) { setActiveTab(tabs[currentIndex + 1]); window.scrollTo({ top: 0, behavior: 'smooth' }); }
            }}
            className="flex-1 h-12 text-base"
          >
            Volgende
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSave}
            className="flex-1 h-12 text-base font-semibold"
          >
            <Save className="h-5 w-5 mr-2" />
            Opslaan
          </Button>
        )}
      </div>
      </>}
    </div>
  );
});
