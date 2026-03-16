"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ButtonGroup } from "./button-group";
import {
  spiritTypeOpties,
  spiritsHelderheidOpties,
  spiritsKleurIntensiteitOpties,
  spiritsKleurOpties,
  spiritsConditieOpties,
  spiritsIntensiteitOpties,
  spiritsZoetheidOpties,
  spiritsTextuurOpties,
  spiritsAfdronkLengteOpties,
  spiritsComplexiteitOpties,
  spiritsKwaliteitOpties,
  spiritsAromaCategorieen,
} from "@/data/wset-spirits-options";
import type { WsetSpiritsTasting, SpiritType } from "@/types/wset-spirits";
import { createEmptySpiritsTasting } from "@/types/wset-spirits";
import { Eye, Flower2, UtensilsCrossed, Award, Save, X } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface SpiritsFormHandle {
  mergeAIData: (aiData: Partial<WsetSpiritsTasting>) => void;
  getData: () => WsetSpiritsTasting;
}

interface SpiritsFormProps {
  initialData?: WsetSpiritsTasting;
  persoonlijkeNotitie?: string;
  score?: number;
  onSave: (data: WsetSpiritsTasting, notitie?: string, score?: number) => void;
}

// Aroma selector per categorie
function AromaCategoryPicker({
  label,
  aromas,
  selected,
  onChange,
}: {
  label: string;
  aromas: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const [zoek, setZoek] = useState("");

  const filtered = zoek
    ? aromas.filter((a) => a.toLowerCase().includes(zoek.toLowerCase()))
    : aromas;

  const toggle = (aroma: string) => {
    if (selected.includes(aroma)) {
      onChange(selected.filter((a) => a !== aroma));
    } else {
      onChange([...selected, aroma]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>

      {/* Geselecteerd */}
      {selected.length > 0 && (
        <ScrollArea className="max-h-24">
          <div className="flex flex-wrap gap-1 pr-4">
            {selected.map((a) => (
              <Badge
                key={a}
                variant="secondary"
                className="cursor-pointer text-xs"
                onClick={() => toggle(a)}
              >
                {a} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Zoek */}
      <Input
        placeholder={`Search ${label.toLowerCase()}...`}
        value={zoek}
        onChange={(e) => setZoek(e.target.value)}
        className="h-10 text-sm"
      />

      {/* Opties */}
      <div className="rounded-md border p-2 bg-muted/30">
        <div className="flex flex-wrap gap-1">
          {filtered.map((aroma) => (
            <Badge
              key={aroma}
              variant={selected.includes(aroma) ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => toggle(aroma)}
            >
              {aroma}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export const SpiritsForm = forwardRef<SpiritsFormHandle, SpiritsFormProps>(
  function SpiritsForm({ initialData, persoonlijkeNotitie: initialNotitie, score: initialScore, onSave }, ref) {
    const [data, setData] = useState<WsetSpiritsTasting>(
      initialData || createEmptySpiritsTasting()
    );
    const [notitie, setNotitie] = useState(initialNotitie || "");
    const [score, setScore] = useState<number | undefined>(initialScore);
    const [activeTab, setActiveTab] = useState("appearance");

    useImperativeHandle(ref, () => ({
      mergeAIData: (aiData: Partial<WsetSpiritsTasting>) => {
        setData((current) => ({ ...current, ...aiData }));
      },
      getData: () => data,
    }), [data]);

    const validateRequiredFields = (): { isValid: boolean; missing: string[] } => {
      const missing: string[] = [];

      // Appearance - all required
      if (!data.uiterlijk.helderheid) missing.push('Appearance → Clarity');
      if (!data.uiterlijk.intensiteit) missing.push('Appearance → Colour intensity');
      if (!data.uiterlijk.kleur) missing.push('Appearance → Colour');

      // Nose - essential fields
      if (!data.neus.conditie) missing.push('Nose → Condition');
      if (!data.neus.intensiteit) missing.push('Nose → Intensity');

      // Palate - essential fields
      if (!data.gehemelte.zoetheid) missing.push('Palate → Sweetness');
      if (!data.gehemelte.smaakIntensiteit) missing.push('Palate → Flavour intensity');
      if (!data.gehemelte.afdronk.lengte) missing.push('Palate → Finish (Length)');
      if (!data.gehemelte.afdronk.complexiteit) missing.push('Palate → Finish (Nature)');

      // Conclusions - all required
      if (!data.conclusie.kwaliteit) missing.push('Conclusions → Quality level');

      return { isValid: missing.length === 0, missing };
    };

    const handleSave = () => {
      const validation = validateRequiredFields();
      if (!validation.isValid) {
        const count = validation.missing.length;
        toast.error(
          `Please complete ${count} required field${count > 1 ? 's' : ''}: ${validation.missing.slice(0, 3).join(', ')}${count > 3 ? ` and ${count - 3} more...` : ''}`,
          { duration: 6000 }
        );
        return;
      }

      onSave(data, notitie, score);
    };

    return (
      <div className="space-y-6">
        {/* Meta */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Naam</Label>
                <Input
                  placeholder="Bijv. Glenfiddich 18"
                  value={data.naam}
                  onChange={(e) => setData({ ...data, naam: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Merk</Label>
                <Input
                  placeholder="Bijv. Glenfiddich"
                  value={data.merk || ""}
                  onChange={(e) => setData({ ...data, merk: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Land</Label>
                <Input
                  placeholder="Schotland"
                  value={data.land || ""}
                  onChange={(e) => setData({ ...data, land: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Leeftijd</Label>
                <Input
                  placeholder="12 jaar"
                  value={data.leeftijd || ""}
                  onChange={(e) => setData({ ...data, leeftijd: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Alcohol %</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="40"
                  value={data.alcoholPercentage || ""}
                  onChange={(e) => setData({ ...data, alcoholPercentage: parseFloat(e.target.value) || undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label>Prijs (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="55.00"
                  value={data.prijs || ""}
                  onChange={(e) => setData({ ...data, prijs: parseFloat(e.target.value) || undefined })}
                />
              </div>
            </div>

            <ButtonGroup
              label="Type spirit"
              opties={spiritTypeOpties}
              waarde={data.type}
              onChange={(type) => setData({ ...data, type: type as SpiritType })}
              size="sm"
            />
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="appearance" className="text-xs gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="nose" className="text-xs gap-1">
              <Flower2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Nose</span>
            </TabsTrigger>
            <TabsTrigger value="palate" className="text-xs gap-1">
              <UtensilsCrossed className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Palate</span>
            </TabsTrigger>
            <TabsTrigger value="conclusions" className="text-xs gap-1">
              <Award className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Conclusions</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="appearance">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <ButtonGroup
                    label="Clarity"
                    opties={spiritsHelderheidOpties}
                    waarde={data.uiterlijk.helderheid}
                    onChange={(val) => setData({ ...data, uiterlijk: { ...data.uiterlijk, helderheid: val as 'helder' | 'troebel' } })}
                  />
                  <ButtonGroup
                    label="Colour intensity"
                    opties={spiritsKleurIntensiteitOpties}
                    waarde={data.uiterlijk.intensiteit}
                    onChange={(val) => setData({ ...data, uiterlijk: { ...data.uiterlijk, intensiteit: val as typeof data.uiterlijk.intensiteit } })}
                  />
                  <ButtonGroup
                    label="Colour"
                    opties={spiritsKleurOpties}
                    waarde={data.uiterlijk.kleur}
                    onChange={(val) => setData({ ...data, uiterlijk: { ...data.uiterlijk, kleur: val } })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nose">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <ButtonGroup
                    label="Condition"
                    opties={spiritsConditieOpties}
                    waarde={data.neus.conditie}
                    onChange={(val) => setData({ ...data, neus: { ...data.neus, conditie: val as 'schoon' | 'onzuiver' } })}
                  />
                  <ButtonGroup
                    label="Intensity"
                    opties={spiritsIntensiteitOpties}
                    waarde={data.neus.intensiteit}
                    onChange={(val) => setData({ ...data, neus: { ...data.neus, intensiteit: val as typeof data.neus.intensiteit } })}
                  />

                  {/* Aroma characteristics */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Aroma characteristics</label>
                    {Object.entries(spiritsAromaCategorieen).map(([key, cat]) => (
                      <AromaCategoryPicker
                        key={key}
                        label={cat.label}
                        aromas={cat.aromas}
                        selected={data.neus.aromaKenmerken[key as keyof typeof data.neus.aromaKenmerken]}
                        onChange={(val) =>
                          setData({
                            ...data,
                            neus: {
                              ...data.neus,
                              aromaKenmerken: {
                                ...data.neus.aromaKenmerken,
                                [key]: val,
                              },
                            },
                          })
                        }
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="palate">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <ButtonGroup
                    label="Sweetness"
                    opties={spiritsZoetheidOpties}
                    waarde={data.gehemelte.zoetheid}
                    onChange={(val) => setData({ ...data, gehemelte: { ...data.gehemelte, zoetheid: val as typeof data.gehemelte.zoetheid } })}
                  />
                  <ButtonGroup
                    label="Flavour intensity"
                    opties={spiritsIntensiteitOpties}
                    waarde={data.gehemelte.smaakIntensiteit}
                    onChange={(val) => setData({ ...data, gehemelte: { ...data.gehemelte, smaakIntensiteit: val as typeof data.gehemelte.smaakIntensiteit } })}
                  />

                  {/* Texture */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Texture</label>
                    <div className="flex flex-wrap gap-1">
                      {spiritsTextuurOpties.map((opt) => (
                        <Badge
                          key={opt.waarde}
                          variant={data.gehemelte.textuur.includes(opt.waarde) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const textuur = data.gehemelte.textuur.includes(opt.waarde)
                              ? data.gehemelte.textuur.filter((t) => t !== opt.waarde)
                              : [...data.gehemelte.textuur, opt.waarde];
                            setData({ ...data, gehemelte: { ...data.gehemelte, textuur } });
                          }}
                        >
                          {opt.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Flavour characteristics */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Flavour characteristics</label>
                    {Object.entries(spiritsAromaCategorieen).map(([key, cat]) => (
                      <AromaCategoryPicker
                        key={key}
                        label={cat.label}
                        aromas={cat.aromas}
                        selected={data.gehemelte.smaakKenmerken[key as keyof typeof data.gehemelte.smaakKenmerken]}
                        onChange={(val) =>
                          setData({
                            ...data,
                            gehemelte: {
                              ...data.gehemelte,
                              smaakKenmerken: {
                                ...data.gehemelte.smaakKenmerken,
                                [key]: val,
                              },
                            },
                          })
                        }
                      />
                    ))}
                  </div>

                  <ButtonGroup
                    label="Finish — Length"
                    opties={spiritsAfdronkLengteOpties}
                    waarde={data.gehemelte.afdronk.lengte}
                    onChange={(val) => setData({ ...data, gehemelte: { ...data.gehemelte, afdronk: { ...data.gehemelte.afdronk, lengte: val as typeof data.gehemelte.afdronk.lengte } } })}
                  />
                  <ButtonGroup
                    label="Finish — Nature"
                    opties={spiritsComplexiteitOpties}
                    waarde={data.gehemelte.afdronk.complexiteit}
                    onChange={(val) => setData({ ...data, gehemelte: { ...data.gehemelte, afdronk: { ...data.gehemelte.afdronk, complexiteit: val as typeof data.gehemelte.afdronk.complexiteit } } })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conclusions">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <ButtonGroup
                    label="Quality level"
                    opties={spiritsKwaliteitOpties}
                    waarde={data.conclusie.kwaliteit}
                    onChange={(val) => setData({ ...data, conclusie: { kwaliteit: val as typeof data.conclusie.kwaliteit } })}
                  />

                  <div className="space-y-2">
                    <Label>Personal notes</Label>
                    <Textarea
                      placeholder="Your observations..."
                      value={notitie}
                      onChange={(e) => setNotitie(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Score (optioneel, 1-10)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      placeholder="8"
                      value={score ?? ""}
                      onChange={(e) => setScore(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                </CardContent>
              </Card>
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
                const tabs = ["appearance", "nose", "palate", "conclusions"];
                const idx = tabs.indexOf(activeTab);
                if (idx > 0) setActiveTab(tabs[idx - 1]);
              }}
              className="flex-1"
            >
              Previous
            </Button>
          )}
          {activeTab !== "conclusions" ? (
            <Button
              type="button"
              onClick={() => {
                const tabs = ["appearance", "nose", "palate", "conclusions"];
                const idx = tabs.indexOf(activeTab);
                if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
              }}
              className="flex-1"
            >
              Next
            </Button>
          ) : (
            <Button type="button" onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
        </div>
      </div>
    );
  }
);
