"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Wine, Calendar, Search, ChevronRight } from "lucide-react";
import type { SessionSummary } from "@/types/tasting-session";
import { getSessions } from "@/lib/storage-client";

export default function Archief() {
  const [sessies, setSessies] = useState<SessionSummary[]>([]);
  const [zoekterm, setZoekterm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSessies(getSessions());
    setLoading(false);
  }, []);

  const filtered = sessies.filter((s) =>
    s.naam.toLowerCase().includes(zoekterm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <h1 className="text-3xl font-semibold">Archief</h1>

      {/* Zoekbalk */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder="Zoek sessie..."
          value={zoekterm}
          onChange={(e) => setZoekterm(e.target.value)}
          aria-label="Zoek sessies"
          className="pl-9"
        />
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Laden...</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Wine className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>
              {zoekterm
                ? "Geen sessies gevonden voor deze zoekopdracht."
                : "Nog geen proefsessies in het archief."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((sessie) => (
            <Link key={sessie.id} href={`/sessie/${sessie.id}`}>
              <Card className="hover:shadow-md hover:border-accent transition-all duration-200 cursor-pointer">
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{sessie.naam}</CardTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
