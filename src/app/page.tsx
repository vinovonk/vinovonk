"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Wine, Calendar, ChevronRight, Trash2 } from "lucide-react";
import type { SessionSummary } from "@/types/tasting-session";
import { toast } from "sonner";
import { getSessions, deleteSession } from "@/lib/storage-client";
import { BiodynamischBadge } from "@/components/biodynamisch-badge";

export default function Dashboard() {
  const [sessies, setSessies] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessies, setSelectedSessies] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);

  useEffect(() => {
    setSessies(getSessions());
    setLoading(false);
  }, []);

  const toggleSelectSessie = (id: string) => {
    setSelectedSessies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBulkDelete = () => {
    const count = selectedSessies.size;
    if (count === 0) return;

    const deletedSessies = sessies.filter((s) => selectedSessies.has(s.id));
    const deletedIds = new Set(selectedSessies);
    setSessies((prev) => prev.filter((s) => !selectedSessies.has(s.id)));
    setSelectedSessies(new Set());
    setIsSelectMode(false);

    let dismissed = false;

    toast.success(`${count} ${count === 1 ? "sessie" : "sessies"} verwijderd`, {
      duration: 5000,
      action: {
        label: "Ongedaan maken",
        onClick: () => {
          dismissed = true;
          setSessies((prev) =>
            [...prev, ...deletedSessies].sort(
              (a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime()
            )
          );
          toast.success(`${count} ${count === 1 ? "sessie" : "sessies"} hersteld`);
        },
      },
      onDismiss: () => {
        if (!dismissed) {
          deletedIds.forEach((id) => deleteSession(id));
        }
      },
    });
  };

  const handleDeleteSessie = (sessieId: string, sessieNaam: string, e: React.MouseEvent) => {
    e.preventDefault();

    const deletedSessie = sessies.find((s) => s.id === sessieId);
    setSessies((prev) => prev.filter((s) => s.id !== sessieId));

    let dismissed = false;

    toast.success(`Sessie "${sessieNaam}" verwijderd`, {
      duration: 5000,
      action: {
        label: "Ongedaan maken",
        onClick: () => {
          dismissed = true;
          if (deletedSessie) {
            setSessies((prev) =>
              [...prev, deletedSessie].sort(
                (a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime()
              )
            );
          }
          toast.success(`Sessie "${sessieNaam}" hersteld`);
        },
      },
      onDismiss: () => {
        if (!dismissed) {
          deleteSession(sessieId);
        }
      },
    });
  };

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Hero */}
      <div className="text-center space-y-3 py-2">
        <h1 className="text-5xl font-semibold tracking-widest uppercase text-primary font-display">VinoVonk</h1>
        <p className="text-muted-foreground text-lg">
          Systematisch proefdagboek · wijn &amp; champagne
        </p>
      </div>

      {/* Biodynamische kalender */}
      <BiodynamischBadge variant="uitgebreid" />

      {/* Snelstart */}
      <div className="flex gap-3">
        <Link href="/sessie/nieuw" className="flex-1 min-w-0">
          <Button size="lg" className="w-full text-base py-6 shadow-md hover:shadow-lg transition-shadow">
            <PlusCircle className="h-5 w-5 shrink-0 mr-2" />
            <span className="truncate">Nieuwe proefsessie starten</span>
          </Button>
        </Link>
        {sessies.length > 0 && (
          <Button
            size="lg"
            variant={isSelectMode ? "default" : "outline"}
            onClick={() => {
              setIsSelectMode(!isSelectMode);
              setSelectedSessies(new Set());
            }}
            className="text-base py-6 px-5 shrink-0 whitespace-nowrap"
          >
            {isSelectMode ? "Annuleren" : "Selecteren"}
          </Button>
        )}
      </div>

      {/* Bulk acties */}
      {isSelectMode && selectedSessies.size > 0 && (
        <Card className="border-2 border-primary">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium">
                {selectedSessies.size} {selectedSessies.size === 1 ? "sessie" : "sessies"} geselecteerd
              </span>
              <Button variant="destructive" onClick={handleBulkDelete} className="h-11">
                <Trash2 className="h-4 w-4 mr-2" />
                Verwijder selectie
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recente sessies */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground border-l-[3px] border-l-primary pl-2">
            Recente sessies
          </h2>
          {!loading && sessies.length > 0 && (
            <span className="text-xs font-black tabular-nums text-muted-foreground" aria-label={`${sessies.length} sessies`}>
              {sessies.length}
            </span>
          )}
        </div>
        {loading ? (
          <div aria-live="polite" className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                      <div className="flex items-center gap-3">
                        <div className="h-3.5 w-24 bg-muted animate-pulse rounded" />
                        <div className="h-3.5 w-16 bg-muted animate-pulse rounded" />
                      </div>
                    </div>
                    <div className="h-6 w-6 bg-muted animate-pulse rounded" />
                  </div>
                </CardHeader>
              </Card>
            ))}
            <span className="sr-only">Sessies worden geladen...</span>
          </div>
        ) : sessies.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-12 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                <Wine className="h-8 w-8 text-primary/60" />
              </div>
              <p className="text-foreground font-medium">Nog geen proefsessies</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Maak je eerste systematische proefnotitie.
              </p>
              <Link href="/sessie/nieuw">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <PlusCircle className="h-4 w-4" />
                  Eerste sessie starten
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="shadow-brutalist">
            {sessies.map((sessie, index) => (
              <Card
                key={sessie.id}
                className={`rounded-none shadow-none border-l-[3px] border-l-primary cursor-pointer hover:bg-accent/50 transition-colors duration-200 ${
                  index > 0 ? "border-t-0" : ""
                } ${
                  isSelectMode && selectedSessies.has(sessie.id) ? "bg-primary/5" : ""
                }`}
              >
                <CardHeader className="py-4">
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="text-2xl font-black text-foreground/10 w-10 text-center tabular-nums shrink-0 select-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {isSelectMode ? (
                      <div className="flex items-center gap-3 flex-1 min-h-[44px]">
                        <Checkbox
                          checked={selectedSessies.has(sessie.id)}
                          onCheckedChange={() => toggleSelectSessie(sessie.id)}
                          className="h-5 w-5"
                        />
                        <div
                          onClick={() => toggleSelectSessie(sessie.id)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSelectSessie(sessie.id); } }}
                          role="button"
                          tabIndex={0}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="space-y-1">
                            <CardTitle className="text-base">{sessie.naam}</CardTitle>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(sessie.datum).toLocaleDateString("nl-NL", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Wine className="h-3.5 w-3.5" />
                                {sessie.aantalFlessen}{" "}
                                {sessie.aantalFlessen === 1 ? "fles" : "flessen"}
                              </span>
                              <BiodynamischBadge datum={sessie.datum} variant="compact" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 flex-1 min-w-0">
                        <Link
                          href={`/sessie/${sessie.id}`}
                          className="flex-1 min-h-[44px] flex items-center min-w-0"
                        >
                          <div className="space-y-1 min-w-0">
                            <CardTitle className="text-base">{sessie.naam}</CardTitle>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(sessie.datum).toLocaleDateString("nl-NL", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Wine className="h-3.5 w-3.5" />
                                {sessie.aantalFlessen}{" "}
                                {sessie.aantalFlessen === 1 ? "fles" : "flessen"}
                              </span>
                              <BiodynamischBadge datum={sessie.datum} variant="compact" />
                            </div>
                          </div>
                        </Link>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteSessie(sessie.id, sessie.naam, e)}
                            className="text-muted-foreground hover:text-destructive h-10 w-10"
                            aria-label={`Sessie "${sessie.naam}" verwijderen`}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                          <Link
                            href={`/sessie/${sessie.id}`}
                            className="flex items-center justify-center h-10 w-10 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            aria-label={`Open sessie "${sessie.naam}"`}
                          >
                            <ChevronRight className="h-6 w-6" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
