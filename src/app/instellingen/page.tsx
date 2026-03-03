"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor, Download, Upload, Info, HardDrive } from "lucide-react";
import { toast } from "sonner";

export default function Instellingen() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // === Data backup ===

  const handleExport = () => {
    const backup: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("vinovonk_")) {
        try {
          backup[key] = JSON.parse(localStorage.getItem(key) || "null");
        } catch {
          backup[key] = localStorage.getItem(key);
        }
      }
    }

    const sessies = Object.keys(backup).filter((k) => k.startsWith("vinovonk_session_")).length;
    if (sessies === 0) {
      toast.info("Geen sessies gevonden om te exporteren.");
      return;
    }

    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vinovonk-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Backup gedownload (${sessies} ${sessies === 1 ? "sessie" : "sessies"})`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target?.result as string) as Record<string, unknown>;
        let count = 0;
        Object.entries(backup).forEach(([key, value]) => {
          if (key.startsWith("vinovonk_")) {
            localStorage.setItem(key, JSON.stringify(value));
            if (key.startsWith("vinovonk_session_") && key !== "vinovonk_sessions_index") count++;
          }
        });
        toast.success(
          `Backup hersteld (${count} ${count === 1 ? "sessie" : "sessies"}) — herlaad de pagina`,
          {
            duration: 8000,
            action: {
              label: "Herladen",
              onClick: () => window.location.reload(),
            },
          }
        );
      } catch {
        toast.error("Ongeldig backup bestand — controleer of het een VinoVonk JSON is.");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // reset input
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <h1 className="text-2xl font-bold">Instellingen</h1>

      {/* Thema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Thema
          </CardTitle>
          <CardDescription>Kies het kleurschema van de app</CardDescription>
        </CardHeader>
        <CardContent>
          {mounted && (
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="flex-1"
              >
                <Sun className="h-4 w-4 mr-2" />
                Licht
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="flex-1"
              >
                <Moon className="h-4 w-4 mr-2" />
                Donker
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
                className="flex-1"
              >
                <Monitor className="h-4 w-4 mr-2" />
                Systeem
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data backup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Gegevens
          </CardTitle>
          <CardDescription>
            Exporteer een backup van al je sessies, of herstel een eerdere backup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Exporteer backup
            </Button>
            <Button
              variant="outline"
              onClick={() => importRef.current?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importeer backup
            </Button>
            <input
              ref={importRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Je data wordt opgeslagen in de browser (localStorage). Exporteer regelmatig een backup
            zodat je niets verliest bij het legen van je browsercache.
          </p>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            Over VinoVonk Tasting Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Deze tool helpt je bij het maken van gestructureerde proefnotities
            volgens het WSET Level 3 Systematic Approach to Tasting (SAT).
          </p>
          <p>
            Alle data wordt lokaal opgeslagen in je browser. Er worden geen
            gegevens naar externe servers gestuurd.
          </p>
          <p>Ondersteunde dranken: wijn, champagne, spirits, bier, sake en meer.</p>
          <p className="font-medium text-foreground mt-3">Gemaakt voor VinoVonk.com</p>
        </CardContent>
      </Card>
    </div>
  );
}
