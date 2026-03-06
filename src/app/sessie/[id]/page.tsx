"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Wine,
  FileDown,
  Trash2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import type { TastingSession } from "@/types/tasting-session";
import { v4 as uuidv4 } from "uuid";
import { createEmptyWineTasting } from "@/types/wset-wine";
import { toast } from "sonner";
import { getSession, addFles, deleteFles, deleteSession } from "@/lib/storage-client";

export default function SessieDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [sessie, setSessie] = useState<TastingSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getSession(id);
    setSessie(data);
    setLoading(false);
  }, [id]);

  const handleAddFles = () => {
    const flesId = uuidv4();
    const now = new Date().toISOString();
    const newFles = {
      id: flesId,
      drankType: "wijn" as const,
      tastingData: createEmptyWineTasting(),
      createdAt: now,
      updatedAt: now,
    };

    const updated = addFles(id, newFles);
    if (updated) {
      setSessie(updated);
      router.push(`/sessie/${id}/fles/${flesId}`);
    }
  };

  const handleDeleteFles = (flesId: string) => {
    if (!sessie) return;
    const verwijderdeFles = sessie.flessen.find((f) => f.id === flesId);
    if (!verwijderdeFles) return;
    const flesNaam = (() => {
      const td = verwijderdeFles.tastingData as unknown as Record<string, unknown>;
      return (td?.wijnNaam || td?.cuveeNaam || td?.naam || "Fles") as string;
    })();

    // Optimistisch verwijderen uit UI
    setSessie({ ...sessie, flessen: sessie.flessen.filter((f) => f.id !== flesId) });

    let dismissed = false;
    toast.success(`"${flesNaam}" verwijderd`, {
      duration: 5000,
      action: {
        label: "Ongedaan maken",
        onClick: () => {
          dismissed = true;
          setSessie((prev) =>
            prev ? { ...prev, flessen: [...prev.flessen, verwijderdeFles] } : prev
          );
          toast.success(`"${flesNaam}" hersteld`);
        },
      },
      onDismiss: () => {
        if (!dismissed) {
          const updated = deleteFles(id, flesId);
          if (updated) setSessie(updated);
        }
      },
    });
  };

  const handleDeleteSessie = () => {
    if (!sessie) return;
    const naam = sessie.naam;

    router.push("/");

    let dismissed = false;
    toast.success(`Sessie "${naam}" verwijderd`, {
      duration: 5000,
      action: {
        label: "Ongedaan maken",
        onClick: () => {
          dismissed = true;
          router.push(`/sessie/${id}`);
          toast.success(`Sessie "${naam}" hersteld`);
        },
      },
      onDismiss: () => {
        if (!dismissed) {
          deleteSession(id);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">Laden...</div>
    );
  }

  if (!sessie) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Sessie niet gevonden</p>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            Terug naar dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/"
            className="text-base text-muted-foreground hover:text-foreground flex items-center gap-1.5 mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <h1 className="text-3xl font-bold">{sessie.naam}</h1>
          <p className="text-base text-muted-foreground mt-2">
            {new Date(sessie.datum).toLocaleDateString("nl-NL", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {" · "}
            {sessie.flessen.length}{" "}
            {sessie.flessen.length === 1 ? "fles" : "flessen"}
          </p>
          {sessie.beschrijving && (
            <p className="text-base text-muted-foreground mt-3">
              {sessie.beschrijving}
            </p>
          )}
        </div>
      </div>

      {/* Acties */}
      <div className="flex gap-3">
        <Button onClick={handleAddFles} className="flex-1 h-12 text-base">
          <PlusCircle className="h-5 w-5 mr-2" />
          Fles toevoegen
        </Button>
        {sessie.flessen.length > 0 && (
          <Link href={`/sessie/${id}/export`}>
            <Button variant="outline" className="h-12 text-base">
              <FileDown className="h-5 w-5 mr-2" />
              Exporteren
            </Button>
          </Link>
        )}
        <Button
          variant="outline"
          onClick={handleDeleteSessie}
          className="h-12 text-base text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Flessenlijst */}
      {sessie.flessen.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <Wine className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Nog geen flessen in deze sessie.</p>
            <p className="text-base mt-2">
              Voeg je eerste fles toe om te beginnen met proeven!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessie.flessen.map((fles, index) => {
            const td = fles.tastingData;
            const naam = td
              ? "wijnNaam" in td && (td as { wijnNaam: string }).wijnNaam
                ? (td as { wijnNaam: string }).wijnNaam
                : "cuveeNaam" in td && (td as { cuveeNaam: string }).cuveeNaam
                  ? (td as { cuveeNaam: string }).cuveeNaam
                  : "naam" in td && (td as { naam: string }).naam
                    ? (td as { naam: string }).naam
                    : ""
              : "";

            return (
              <Card
                key={fles.id}
                className="hover:shadow-md hover:border-accent transition-all duration-200"
              >
                <CardHeader className="py-4 px-5">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/sessie/${id}/fles/${fles.id}`}
                      className="flex-1 min-h-[44px] flex items-center"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-muted-foreground/40 w-8">
                          {index + 1}
                        </span>
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {naam || "Nieuwe fles"}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="outline" className="text-sm px-2.5 py-0.5 capitalize">
                              {fles.drankType}
                            </Badge>
                            {fles.score !== undefined && (
                              <Badge variant="secondary" className="text-sm px-2.5 py-0.5">
                                {fles.score}/100
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFles(fles.id)}
                        className="text-muted-foreground hover:text-destructive h-10 w-10"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                      <Link href={`/sessie/${id}/fles/${fles.id}`}>
                        <ChevronRight className="h-6 w-6 text-muted-foreground" />
                      </Link>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
