"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Download, Check, Mail } from "lucide-react";
import type { TastingSession } from "@/types/tasting-session";
import { generateSessionMarkdown } from "@/lib/export";
import { toast } from "sonner";
import { getSession } from "@/lib/storage-client";

export default function ExportPagina() {
  const params = useParams();
  const id = params.id as string;
  const [sessie, setSessie] = useState<TastingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [markdown, setMarkdown] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = getSession(id);
    setSessie(data);
    if (data) setMarkdown(generateSessionMarkdown(data));
    setLoading(false);
  }, [id]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    toast.success("Gekopieerd naar klembord!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadBestand = (bestandsnaam: string) => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = bestandsnaam;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleMail = () => {
    const subject = encodeURIComponent(`Proefsessie: ${sessie?.naam || "export"}`);
    const MAILTO_LIMIET = 1800;

    if (markdown.length > MAILTO_LIMIET) {
      const bestandsnaam = `proefsessie-${sessie?.datum || "export"}.md`;
      downloadBestand(bestandsnaam);
      const body = encodeURIComponent(
        `Zie het bijgevoegde bestand "${bestandsnaam}" voor de volledige proefnotities.`
      );
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      toast.info("Sessie is te lang voor e-mailbody — bestand gedownload, voeg het toe als bijlage.");
    } else {
      const body = encodeURIComponent(markdown);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  };

  const handleDownload = () => {
    downloadBestand(`proefsessie-${sessie?.datum || "export"}.md`);
    toast.success("Bestand gedownload!");
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">Laden...</div>
    );
  }

  if (!sessie) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Sessie niet gevonden
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div>
        <Link
          href={`/sessie/${id}`}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Terug naar sessie
        </Link>
        <h1 className="text-2xl font-bold">Export</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {sessie.naam} · {sessie.flessen.length}{" "}
          {sessie.flessen.length === 1 ? "fles" : "flessen"}
        </p>
      </div>

      {/* Acties */}
      <div className="flex gap-2">
        <Button onClick={handleCopy} variant="outline" className="flex-1">
          {copied ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? "Gekopieerd!" : "Kopieer"}
        </Button>
        <Button onClick={handleMail} variant="outline" className="flex-1">
          <Mail className="h-4 w-4 mr-2" />
          Mail
        </Button>
        <Button onClick={handleDownload} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: Plak de Markdown in een Claude Project of chat om er een artikel
        van te maken voor VinoVonk.com!
      </p>

      {/* Preview */}
      <Card>
        <CardContent className="py-4">
          <pre className="text-xs whitespace-pre-wrap font-mono text-muted-foreground leading-relaxed overflow-x-auto">
            {markdown}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
