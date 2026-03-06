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
        <h1 className="text-5xl font-semibold tracking-tight text-primary">VinoVonk</h1>
        <p className="text-muted-foreground text-lg">
          Proefnotities volgens WSET Level 3
        </p>
      </div>

      {/* Biodynamische kalender */}
      <BiodynamischBadge variant="uitgebreid" />

      {/* Snelstart */}
      <div className="flex gap-3">
        <Link href="/sessie/nieuw" className="flex-1 min-w-0">
          <Button size="lg" className="w-full text-base py-6">
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
        <h2 className="text-lg font-semibold">Recente sessies</h2>
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">Laden...</CardContent>
          </Card>
        ) : sessies.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Wine className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Nog geen proefsessies.</p>
              <p className="text-sm mt-1">Start je eerste sessie hierboven!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {sessies.map((sessie) => (
              <Card
                key={sessie.id}
                className={`hover:bg-accent/50 transition-colors ${
                  isSelectMode && selectedSessies.has(sessie.id) ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between gap-3">
                    {isSelectMode ? (
                      <div className="flex items-center gap-3 flex-1 min-h-[44px]">
                        <Checkbox
                          checked={selectedSessies.has(sessie.id)}
                          onCheckedChange={() => toggleSelectSessie(sessie.id)}
                          className="h-5 w-5"
                        />
                        <div
                          onClick={() => toggleSelectSessie(sessie.id)}
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
                      <>
                        <Link
                          href={`/sessie/${sessie.id}`}
                          className="flex-1 min-h-[44px] flex items-center"
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
                        </Link>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteSessie(sessie.id, sessie.naam, e)}
                            className="text-muted-foreground hover:text-destructive h-10 w-10"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                          <Link href={`/sessie/${sessie.id}`}>
                            <ChevronRight className="h-6 w-6 text-muted-foreground" />
                          </Link>
                        </div>
                      </>
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
