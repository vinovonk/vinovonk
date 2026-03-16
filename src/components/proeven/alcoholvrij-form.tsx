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
import type { AlcoholVrijTasting, AlcoholVrijSubType } from "@/types/alcoholvrij";
import { createEmptyAlcoholVrijTasting } from "@/types/alcoholvrij";
import { Eye, Flower2, UtensilsCrossed, Award, Save, X } from "lucide-react";

export interface AlcoholVrijFormHandle {
  mergeAIData: (aiData: Partial<AlcoholVrijTasting>) => void;
  getData: () => AlcoholVrijTasting;
}

interface AlcoholVrijFormProps {
  initialData?: AlcoholVrijTasting;
  persoonlijkeNotitie?: string;
  score?: number;
  onSave: (data: AlcoholVrijTasting, notitie?: string, score?: number) => void;
}

const subTypeOpties: { waarde: AlcoholVrijSubType; label: string }[] = [
  { waarde: "proxy-wijn", label: "Proxy-wijn" },
  { waarde: "spirit-0", label: "Spirit 0%" },
  { waarde: "thee", label: "Thee" },
  { waarde: "anders", label: "Anders" },
];

const helderheidOpties = [
  { waarde: "helder", label: "Clear" },
  { waarde: "troebel", label: "Hazy" },
];

const intensiteitOpties = [
  { waarde: "licht", label: "Light" },
  { waarde: "medium", label: "Medium" },
  { waarde: "uitgesproken", label: "Pronounced" },
];

const zoetheidOpties = [
  { waarde: "droog", label: "Dry" },
  { waarde: "halfdroog", label: "Off-dry" },
  { waarde: "medium", label: "Medium" },
  { waarde: "zoet", label: "Sweet" },
];

const drieSchaalOpties = [
  { waarde: "laag", label: "Low" },
  { waarde: "medium", label: "Medium" },
  { waarde: "hoog", label: "High" },
];

const bodyOpties = [
  { waarde: "licht", label: "Light" },
  { waarde: "medium", label: "Medium" },
  { waarde: "vol", label: "Full" },
];

const afdronkOpties = [
  { waarde: "kort", label: "Short" },
  { waarde: "medium", label: "Medium" },
  { waarde: "lang", label: "Long" },
];

const kwaliteitOpties = [
  { waarde: "slecht", label: "Poor" },
  { waarde: "acceptabel", label: "Acceptable" },
  { waarde: "goed", label: "Good" },
  { waarde: "zeer_goed", label: "Very good" },
  { waarde: "uitmuntend", label: "Outstanding" },
];

// Aroma's per subtype
const proxyWijnAromas = [
  "rood fruit", "kers", "pruim", "braam", "aardbei",
  "citrus", "appel", "peer", "tropisch fruit",
  "bloemen", "roos", "violetje",
  "kruiden", "specerijen", "vanille",
  "eik", "toast", "karamel",
  "mineraal", "aarde", "leer",
];

const spirit0Aromas = [
  "jeneverbes", "citrus", "citroen", "sinaasappel", "grapefruit",
  "bloemen", "lavendel", "elderflower",
  "kruiden", "rozemarijn", "tijm", "komkommer",
  "specerijen", "peper", "kardemom", "kaneel",
  "vanille", "karamel", "honing",
  "gember", "munt", "basilicum",
];

const theeAromas = [
  "floraal", "jasmijn", "roos", "kamille",
  "groen", "gras", "vegetaal", "zeewier",
  "fruit", "citrus", "appel", "peer", "perzik",
  "honingachtig", "karamel", "malty",
  "rokerig", "aards", "houtachtig",
  "kruidig", "munt", "gember", "kaneel",
  "noten", "amandel",
  "umami", "mineraal",
];

const defaultAlcoholVrijAromas = [
  "fruit", "citrus", "bloemen", "kruiden",
  "specerijen", "honing", "karamel",
  "noten", "mineraal", "aarde",
  "vanille", "gember", "munt",
];

function getAromasVoorSubType(subType: AlcoholVrijSubType): string[] {
  switch (subType) {
    case "proxy-wijn": return proxyWijnAromas;
    case "spirit-0": return spirit0Aromas;
    case "thee": return theeAromas;
    default: return defaultAlcoholVrijAromas;
  }
}

export const AlcoholVrijForm = forwardRef<AlcoholVrijFormHandle, AlcoholVrijFormProps>(
  function AlcoholVrijForm({ initialData, persoonlijkeNotitie: initialNotitie, score: initialScore, onSave }, ref) {
    const [data, setData] = useState<AlcoholVrijTasting>(
      initialData || createEmptyAlcoholVrijTasting()
    );
    const [notitie, setNotitie] = useState(initialNotitie || "");
    const [score, setScore] = useState<number | undefined>(initialScore);
    const [activeTab, setActiveTab] = useState("appearance");
    const [customAroma, setCustomAroma] = useState("");

    useImperativeHandle(ref, () => ({
      mergeAIData: (aiData: Partial<AlcoholVrijTasting>) => {
        setData((current) => ({ ...current, ...aiData }));
      },
      getData: () => data,
    }), [data]);

    const isProxyWijn = data.subType === "proxy-wijn";

    const toggleAroma = (list: string[], aroma: string): string[] =>
      list.includes(aroma) ? list.filter((a) => a !== aroma) : [...list, aroma];

    const handleSave = () => {
      onSave(data, notitie, score);
    };

    const beschikbareAromas = getAromasVoorSubType(data.subType);

    return (
      <div className="space-y-6">
        {/* Meta */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Naam</Label>
                <Input
                  placeholder={
                    data.subType === "proxy-wijn" ? "Bijv. Oddbird Sparkling Rosé" :
                    data.subType === "spirit-0" ? "Bijv. Seedlip Garden 108" :
                    data.subType === "thee" ? "Bijv. Gyokuro First Flush" :
                    "Naam..."
                  }
                  value={data.naam}
                  onChange={(e) => setData({ ...data, naam: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Merk / Producent</Label>
                <Input
                  placeholder="Producent..."
                  value={data.merk || ""}
                  onChange={(e) => setData({ ...data, merk: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Stijl</Label>
                <Input
                  placeholder={
                    data.subType === "proxy-wijn" ? "Rood, wit, rosé..." :
                    data.subType === "spirit-0" ? "Gin-style, Rum-style..." :
                    data.subType === "thee" ? "Groene thee, Oolong..." :
                    "Stijl..."
                  }
                  value={data.stijl || ""}
                  onChange={(e) => setData({ ...data, stijl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Land</Label>
                <Input
                  placeholder="Land..."
                  value={data.land || ""}
                  onChange={(e) => setData({ ...data, land: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Prijs (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="12.50"
                  value={data.prijs || ""}
                  onChange={(e) => setData({ ...data, prijs: parseFloat(e.target.value) || undefined })}
                />
              </div>
            </div>

            {/* Subtype selectie */}
            <ButtonGroup
              label="Type alcoholvrij"
              opties={subTypeOpties}
              waarde={data.subType}
              onChange={(val) => setData({ ...data, subType: val as AlcoholVrijSubType })}
              size="sm"
            />

            {/* Vrij tekstveld als subType === 'anders' */}
            {data.subType === "anders" && (
              <div className="space-y-2">
                <Label>Specificeer type</Label>
                <Input
                  placeholder="Bijv. Kombucha, Shrub, Mocktail..."
                  value={data.customSubType || ""}
                  onChange={(e) => setData({ ...data, customSubType: e.target.value })}
                />
              </div>
            )}
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
                    opties={helderheidOpties}
                    waarde={data.uiterlijk.helderheid}
                    onChange={(val) => setData({ ...data, uiterlijk: { ...data.uiterlijk, helderheid: val as typeof data.uiterlijk.helderheid } })}
                  />
                  <div className="space-y-2">
                    <Label>Colour</Label>
                    <Input
                      placeholder="E.g. light gold, ruby red, clear..."
                      value={data.uiterlijk.kleur || ""}
                      onChange={(e) => setData({ ...data, uiterlijk: { ...data.uiterlijk, kleur: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Other observations</Label>
                    <Input
                      placeholder="Other observations..."
                      value={data.uiterlijk.overig || ""}
                      onChange={(e) => setData({ ...data, uiterlijk: { ...data.uiterlijk, overig: e.target.value } })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nose">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <ButtonGroup
                    label="Intensity"
                    opties={intensiteitOpties}
                    waarde={data.neus.intensiteit}
                    onChange={(val) => setData({ ...data, neus: { ...data.neus, intensiteit: val as typeof data.neus.intensiteit } })}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Aroma characteristics</label>
                    {data.neus.aromas.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {data.neus.aromas.map((a) => (
                          <Badge key={a} variant="secondary" className="cursor-pointer text-xs" onClick={() => setData({ ...data, neus: { ...data.neus, aromas: toggleAroma(data.neus.aromas, a) } })}>
                            {a} <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
                      {beschikbareAromas.map((aroma) => (
                        <Badge
                          key={aroma}
                          variant={data.neus.aromas.includes(aroma) ? "default" : "outline"}
                          className="cursor-pointer text-xs"
                          onClick={() => setData({ ...data, neus: { ...data.neus, aromas: toggleAroma(data.neus.aromas, aroma) } })}
                        >
                          {aroma}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Add custom aroma..."
                        value={customAroma}
                        onChange={(e) => setCustomAroma(e.target.value)}
                        className="text-sm h-8"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && customAroma.trim()) {
                            e.preventDefault();
                            setData({ ...data, neus: { ...data.neus, aromas: [...data.neus.aromas, customAroma.trim()] } });
                            setCustomAroma("");
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => {
                          if (customAroma.trim()) {
                            setData({ ...data, neus: { ...data.neus, aromas: [...data.neus.aromas, customAroma.trim()] } });
                            setCustomAroma("");
                          }
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="palate">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <ButtonGroup
                    label="Sweetness"
                    opties={zoetheidOpties}
                    waarde={data.gehemelte.zoetheid}
                    onChange={(val) => setData({ ...data, gehemelte: { ...data.gehemelte, zoetheid: val as typeof data.gehemelte.zoetheid } })}
                  />
                  <ButtonGroup
                    label="Acidity"
                    opties={drieSchaalOpties}
                    waarde={data.gehemelte.zuurgraad}
                    onChange={(val) => setData({ ...data, gehemelte: { ...data.gehemelte, zuurgraad: val as typeof data.gehemelte.zuurgraad } })}
                  />

                  {/* Tannin — relevant for proxy wine */}
                  {isProxyWijn && (
                    <ButtonGroup
                      label="Tannin"
                      opties={drieSchaalOpties}
                      waarde={data.gehemelte.tannine || null}
                      onChange={(val) => setData({ ...data, gehemelte: { ...data.gehemelte, tannine: val as typeof data.gehemelte.tannine } })}
                    />
                  )}

                  <ButtonGroup
                    label="Body"
                    opties={bodyOpties}
                    waarde={data.gehemelte.body}
                    onChange={(val) => setData({ ...data, gehemelte: { ...data.gehemelte, body: val as typeof data.gehemelte.body } })}
                  />

                  {/* Bitterness */}
                  <ButtonGroup
                    label="Bitterness"
                    opties={drieSchaalOpties}
                    waarde={data.gehemelte.bitterheid || null}
                    onChange={(val) => setData({ ...data, gehemelte: { ...data.gehemelte, bitterheid: val as typeof data.gehemelte.bitterheid } })}
                  />

                  {/* Carbonation */}
                  <ButtonGroup
                    label="Carbonation"
                    opties={drieSchaalOpties}
                    waarde={data.gehemelte.koolzuur || null}
                    onChange={(val) => setData({ ...data, gehemelte: { ...data.gehemelte, koolzuur: val as typeof data.gehemelte.koolzuur } })}
                  />

                  {/* Flavour characteristics */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Flavour characteristics</label>
                    <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
                      {beschikbareAromas.map((smaak) => (
                        <Badge
                          key={smaak}
                          variant={data.gehemelte.smaken.includes(smaak) ? "default" : "outline"}
                          className="cursor-pointer text-xs"
                          onClick={() => setData({ ...data, gehemelte: { ...data.gehemelte, smaken: toggleAroma(data.gehemelte.smaken, smaak) } })}
                        >
                          {smaak}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <ButtonGroup
                    label="Finish"
                    opties={afdronkOpties}
                    waarde={data.gehemelte.afdronk}
                    onChange={(val) => setData({ ...data, gehemelte: { ...data.gehemelte, afdronk: val as typeof data.gehemelte.afdronk } })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conclusions">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <ButtonGroup
                    label="Quality level"
                    opties={kwaliteitOpties}
                    waarde={data.conclusie.kwaliteit}
                    onChange={(val) => setData({ ...data, conclusie: { ...data.conclusie, kwaliteit: val as typeof data.conclusie.kwaliteit } })}
                  />

                  <div className="space-y-2">
                    <Label>Comparison with alcoholic variant</Label>
                    <Textarea
                      placeholder="How does this compare to the alcoholic version? What is missing, what is better?"
                      value={data.conclusie.vergelijkingMetAlcohol || ""}
                      onChange={(e) => setData({ ...data, conclusie: { ...data.conclusie, vergelijkingMetAlcohol: e.target.value } })}
                      rows={3}
                    />
                  </div>

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
                      placeholder="7"
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
