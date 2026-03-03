"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { createSession } from "@/lib/storage-client";

export default function NieuweSessie() {
  const router = useRouter();
  const [naam, setNaam] = useState("");
  const [beschrijving, setBeschrijving] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naam.trim()) return;

    setLoading(true);
    const session = createSession(naam.trim(), beschrijving.trim() || undefined);
    router.push(`/sessie/${session.id}`);
  };

  return (
    <div className="max-w-lg mx-auto pb-20 md:pb-8">
      <h1 className="text-2xl font-bold mb-6">Nieuwe proefsessie</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sessie details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="naam">Naam van de sessie *</Label>
              <Input
                id="naam"
                placeholder="Bijv. Italiaanse wijnavond, Whisky tasting club..."
                value={naam}
                onChange={(e) => setNaam(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beschrijving">Beschrijving (optioneel)</Label>
              <Textarea
                id="beschrijving"
                placeholder="Context, aanleiding, gasten..."
                value={beschrijving}
                onChange={(e) => setBeschrijving(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!naam.trim() || loading}
            >
              {loading ? "Aanmaken..." : "Sessie starten"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
