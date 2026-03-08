"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { WsetForm } from "@/components/proeven/wset-form";
import type { WsetFormHandle } from "@/components/proeven/wset-form";
import { SpiritsForm } from "@/components/proeven/spirits-form";
import type { SpiritsFormHandle } from "@/components/proeven/spirits-form";
import { GenericForm } from "@/components/proeven/generic-form";
import type { GenericFormHandle } from "@/components/proeven/generic-form";
import { AlcoholVrijForm } from "@/components/proeven/alcoholvrij-form";
import type { AlcoholVrijFormHandle } from "@/components/proeven/alcoholvrij-form";
import { ChampagneForm } from "@/components/proeven/champagne-form";
import type { ChampagneFormHandle } from "@/components/proeven/champagne-form";
import { FotoCapture } from "@/components/proeven/foto-capture";
import { ButtonGroup } from "@/components/proeven/button-group";
import type { TastingSession, DrankType, TastingData } from "@/types/tasting-session";
import type { WsetWineTasting } from "@/types/wset-wine";
import { createEmptyWineTasting } from "@/types/wset-wine";
import type { WsetSpiritsTasting } from "@/types/wset-spirits";
import { createEmptySpiritsTasting } from "@/types/wset-spirits";
import type { GenericTasting, AnderDrankType } from "@/types/wset-other";
import { createEmptyGenericTasting } from "@/types/wset-other";
import type { AlcoholVrijTasting } from "@/types/alcoholvrij";
import { createEmptyAlcoholVrijTasting } from "@/types/alcoholvrij";
import type { ChampagneTasting } from "@/types/champagne";
import { createEmptyChampagneTasting } from "@/types/champagne";
import { toast } from "sonner";
import { getSession, updateFles, compressImage } from "@/lib/storage-client";

// Type guards
function isWineData(data: TastingData): data is WsetWineTasting {
  return data && "wijnNaam" in data;
}

function isSpiritsData(data: TastingData): data is WsetSpiritsTasting {
  return data && "type" in data && "neus" in data && "aromaKenmerken" in (data as WsetSpiritsTasting).neus;
}

function isGenericData(data: TastingData): data is GenericTasting {
  return data && "type" in data && "neus" in data && "aromas" in (data as GenericTasting).neus && !("subType" in data);
}

function isAlcoholVrijData(data: TastingData): data is AlcoholVrijTasting {
  return data && "subType" in data;
}

function isChampagneData(data: TastingData): data is ChampagneTasting {
  return data && "cuveeNaam" in data;
}

const drankTypeOpties = [
  { waarde: "wijn" as DrankType, label: "Wijn" },
  { waarde: "champagne" as DrankType, label: "Champagne" },
  { waarde: "spirit" as DrankType, label: "Spirit" },
  { waarde: "bier" as DrankType, label: "Bier" },
  { waarde: "sake" as DrankType, label: "Sake" },
  { waarde: "alcoholvrij" as DrankType, label: "0%" },
  { waarde: "anders" as DrankType, label: "Anders" },
];

export default function FlesProeven() {
  const params = useParams();
  const router = useRouter();
  const sessieId = params.id as string;
  const flesId = params.flesId as string;

  const [sessie, setSessie] = useState<TastingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [drankType, setDrankType] = useState<DrankType>("wijn");
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  // Twee-staps flow (wijn & champagne)
  const [faseProeven, setFaseProeven] = useState<"info" | "proeven">("info");
  const [wijnSummary, setWijnSummary] = useState<string>("");

  // Refs voor getData() in twee-staps navigatie
  const wijnFormRef = useRef<WsetFormHandle>(null);
  const spiritsFormRef = useRef<SpiritsFormHandle>(null);
  const genericFormRef = useRef<GenericFormHandle>(null);
  const alcoholVrijFormRef = useRef<AlcoholVrijFormHandle>(null);
  const champagneFormRef = useRef<ChampagneFormHandle>(null);

  // Laad sessie uit localStorage
  useEffect(() => {
    const sessionData = getSession(sessieId);
    setSessie(sessionData);

    const fles = sessionData?.flessen?.find((f) => f.id === flesId);
    if (fles) {
      setDrankType(fles.drankType || "wijn");
      if (fles.fotoPath) setFotoPreview(fles.fotoPath);
    }

    setLoading(false);
  }, [sessieId, flesId]);

  const fles = sessie?.flessen.find((f) => f.id === flesId);

  // Leeg tastingData object voor een dranktype
  const createEmptyTastingData = useCallback((type: DrankType): TastingData => {
    switch (type) {
      case "wijn":
        return createEmptyWineTasting();
      case "champagne":
        return createEmptyChampagneTasting();
      case "spirit":
        return createEmptySpiritsTasting();
      case "bier":
        return { ...createEmptyGenericTasting(), type: "bier" as AnderDrankType };
      case "sake":
        return { ...createEmptyGenericTasting(), type: "sake" as AnderDrankType };
      case "alcoholvrij":
        return createEmptyAlcoholVrijTasting();
      case "anders":
      default:
        return { ...createEmptyGenericTasting(), type: "anders" as AnderDrankType };
    }
  }, []);

  // DrankType wijzigen
  const handleDrankTypeChange = useCallback(
    (newType: string) => {
      const type = newType as DrankType;
      setDrankType(type);

      const newTastingData = createEmptyTastingData(type);
      updateFles(sessieId, flesId, { drankType: type, tastingData: newTastingData });

      setSessie((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          flessen: prev.flessen.map((f) =>
            f.id === flesId ? { ...f, drankType: type, tastingData: newTastingData } : f
          ),
        };
      });
    },
    [sessieId, flesId, createEmptyTastingData]
  );

  // Foto: comprimeer naar base64 en sla op in localStorage
  const handleFotoChange = useCallback(
    async (file: File | null, previewUrl: string | null) => {
      if (file) {
        setFotoPreview(previewUrl); // direct weergeven (object URL)
        try {
          const base64 = await compressImage(file);
          updateFles(sessieId, flesId, { fotoPath: base64 });
          setFotoPreview(base64); // vervang met compressed base64
          toast.success("Foto opgeslagen!");
        } catch {
          toast.error("Fout bij verwerken foto");
        }
      } else {
        setFotoPreview(null);
        updateFles(sessieId, flesId, { fotoPath: undefined });
      }
    },
    [sessieId, flesId]
  );

  // Formulier opslaan
  const handleSaveWijn = (tastingData: WsetWineTasting, notitie?: string, score?: number) => {
    saveTasting(tastingData, notitie, score);
  };

  const handleSaveSpirits = (tastingData: WsetSpiritsTasting, notitie?: string, score?: number) => {
    saveTasting(tastingData, notitie, score);
  };

  const handleSaveGeneric = (tastingData: GenericTasting, notitie?: string, score?: number) => {
    saveTasting(tastingData, notitie, score);
  };

  const handleSaveAlcoholVrij = (tastingData: AlcoholVrijTasting, notitie?: string, score?: number) => {
    saveTasting(tastingData, notitie, score);
  };

  const handleSaveChampagne = (tastingData: ChampagneTasting, notitie?: string, score?: number) => {
    saveTasting(tastingData, notitie, score);
  };

  const saveTasting = (tastingData: TastingData, notitie?: string, score?: number) => {
    const updated = updateFles(sessieId, flesId, {
      tastingData,
      drankType,
      persoonlijkeNotitie: notitie,
      score,
    });

    if (updated) {
      toast.success("Proefnotitie opgeslagen!");
      router.push(`/sessie/${sessieId}`);
    } else {
      toast.error("Fout bij opslaan");
    }
  };

  // Twee-staps navigatie (wijn & champagne)
  const handleNaarProeven = useCallback(() => {
    if (drankType === "wijn" && wijnFormRef.current) {
      const d = wijnFormRef.current.getData();
      const parts: string[] = [];
      if (d.wijnNaam) parts.push(d.wijnNaam);
      if (d.jaargang != null) parts.push(d.jaargang === 0 ? "NV" : String(d.jaargang));
      if (d.wijnType) parts.push(d.wijnType.charAt(0).toUpperCase() + d.wijnType.slice(1));
      setWijnSummary(parts.join(" · "));
    } else if (drankType === "champagne" && champagneFormRef.current) {
      const d = champagneFormRef.current.getData();
      const parts: string[] = [];
      if (d.cuveeNaam) parts.push(d.cuveeNaam);
      if (d.producent) parts.push(d.producent);
      if (d.stijl) parts.push(d.stijl.replace(/_/g, " "));
      setWijnSummary(parts.join(" · "));
    }
    setFaseProeven("proeven");
    const shouldAnimate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: shouldAnimate ? "smooth" : "auto" });
  }, [drankType]);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Laden...</div>;
  }

  if (!sessie || !fles) {
    return <div className="text-center py-12 text-muted-foreground">Fles niet gevonden</div>;
  }

  const isWijn = drankType === "wijn";
  const isChampagne = drankType === "champagne";
  const isTweeStaps = isWijn || isChampagne;

  return (
    <div className="pb-20 md:pb-8 space-y-6">
      {/* Navigatie */}
      {faseProeven === "info" || !isTweeStaps ? (
        <Link
          href={`/sessie/${sessieId}`}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Terug naar {sessie.naam}
        </Link>
      ) : (
        <button
          onClick={() => {
            setFaseProeven("info");
            const shouldAnimate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: 0, behavior: shouldAnimate ? "smooth" : "auto" });
          }}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {isChampagne ? "Champagne info aanpassen" : "Wijn info aanpassen"}
        </button>
      )}

      {/* Stap indicator (wijn & champagne) */}
      {isTweeStaps && (
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            {/* Stap 1 */}
            <button
              type="button"
              onClick={() => {
                if (faseProeven === "proeven") {
                  setFaseProeven("info");
                  const shouldAnimate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                  window.scrollTo({ top: 0, behavior: shouldAnimate ? "smooth" : "auto" });
                }
              }}
              className="flex items-center gap-2 group"
              aria-current={faseProeven === "info" ? "step" : undefined}
            >
              <span
                className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-semibold transition-colors ${
                  faseProeven === "info"
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/15 text-primary"
                }`}
              >
                {faseProeven === "proeven" ? "✓" : "1"}
              </span>
              <span
                className={`transition-colors ${
                  faseProeven === "info"
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {isChampagne ? "Info" : "Wijn info"}
              </span>
            </button>

            {/* Verbindingslijn */}
            <div className={`flex-1 h-0.5 rounded-full transition-colors ${
              faseProeven === "proeven" ? "bg-primary/30" : "bg-muted"
            }`} />

            {/* Stap 2 */}
            <div
              className="flex items-center gap-2"
              aria-current={faseProeven === "proeven" ? "step" : undefined}
            >
              <span
                className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-semibold transition-colors ${
                  faseProeven === "proeven"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </span>
              <span
                className={`transition-colors ${
                  faseProeven === "proeven"
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Proeven
              </span>
            </div>
          </div>
          {faseProeven === "proeven" && wijnSummary && (
            <p className="text-xs text-muted-foreground/70 truncate pl-9">{wijnSummary}</p>
          )}
        </div>
      )}

      {/* Stap 1: dranktype & foto — alleen in info-fase of bij niet-twee-staps */}
      {(faseProeven === "info" || !isTweeStaps) && (
        <>
          <ButtonGroup
            label="Type drank"
            opties={drankTypeOpties}
            waarde={drankType}
            onChange={handleDrankTypeChange}
            size="sm"
          />

          <FotoCapture fotoUrl={fotoPreview || undefined} onFotoChange={handleFotoChange} />
        </>
      )}

      {/* Formulier op basis van dranktype */}
      {drankType === "wijn" && (
        <WsetForm
          key={`wijn-${fles.id}`}
          ref={wijnFormRef}
          initialData={isWineData(fles.tastingData) ? fles.tastingData : undefined}
          persoonlijkeNotitie={fles.persoonlijkeNotitie}
          score={fles.score}
          onSave={handleSaveWijn}
          fase={faseProeven}
        />
      )}

      {drankType === "champagne" && (
        <ChampagneForm
          key={`champagne-${fles.id}`}
          ref={champagneFormRef}
          initialData={isChampagneData(fles.tastingData) ? fles.tastingData : undefined}
          persoonlijkeNotitie={fles.persoonlijkeNotitie}
          score={fles.score}
          onSave={handleSaveChampagne}
          fase={faseProeven}
        />
      )}

      {/* Volgende knop: van info naar proeven — sticky op mobile */}
      {isTweeStaps && faseProeven === "info" && (
        <div className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-0 right-0 md:static md:bottom-auto p-4 md:p-0 bg-gradient-to-t from-background via-background to-background/0 md:bg-none z-40">
          <button
            type="button"
            onClick={handleNaarProeven}
            className="w-full h-12 rounded-md bg-primary text-primary-foreground text-base font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg md:shadow-none"
          >
            Volgende — start met proeven
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {drankType === "spirit" && (
        <SpiritsForm
          key={`spirit-${fles.id}`}
          ref={spiritsFormRef}
          initialData={isSpiritsData(fles.tastingData) ? fles.tastingData : undefined}
          persoonlijkeNotitie={fles.persoonlijkeNotitie}
          score={fles.score}
          onSave={handleSaveSpirits}
        />
      )}

      {drankType === "alcoholvrij" && (
        <AlcoholVrijForm
          key={`alcoholvrij-${fles.id}`}
          ref={alcoholVrijFormRef}
          initialData={isAlcoholVrijData(fles.tastingData) ? fles.tastingData : undefined}
          persoonlijkeNotitie={fles.persoonlijkeNotitie}
          score={fles.score}
          onSave={handleSaveAlcoholVrij}
        />
      )}

      {(drankType === "bier" || drankType === "sake" || drankType === "anders") && (
        <GenericForm
          key={`generic-${drankType}-${fles.id}`}
          ref={genericFormRef}
          drankType={drankType as AnderDrankType}
          initialData={isGenericData(fles.tastingData) ? fles.tastingData : undefined}
          persoonlijkeNotitie={fles.persoonlijkeNotitie}
          score={fles.score}
          onSave={handleSaveGeneric}
        />
      )}
    </div>
  );
}
