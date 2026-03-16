import type { Metadata } from "next";
import { ExternalLink, GlassWater, BookOpen, Sparkles, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Over — VinoVonk",
  description: "Over de VinoVonk proefapp en de SAT-methode",
};

export default function OverPage() {
  return (
    <div className="space-y-10 pb-24 md:pb-8 max-w-2xl">

      {/* Hero */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-primary font-display">
          VinoVonk
        </h1>
        <p className="text-muted-foreground text-lg">
          Systematisch proefdagboek · wijn &amp; champagne
        </p>
      </div>

      {/* Over de maker */}
      <section aria-labelledby="over-maker">
        <h2
          id="over-maker"
          className="text-xs font-bold tracking-widest uppercase text-muted-foreground border-l-[3px] border-l-primary pl-2 mb-4"
        >
          De maker
        </h2>
        <div className="space-y-3 text-base text-foreground/85 leading-relaxed">
          <p>
            VinoVonk is gemaakt door{" "}
            <strong className="text-foreground">Jeroen Vonk</strong> — wijnschrijver,
            educator en podcast-host op{" "}
            <a
              href="https://vinovonk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold underline underline-offset-2 hover:opacity-75 transition-opacity inline-flex items-center gap-1"
              aria-label="VinoVonk.com (opent in nieuw tabblad)"
            >
              VinoVonk.com
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
            .
          </p>
          <p>
            De app is een persoonlijk proefdagboek — een plek om waarnemingen vast
            te leggen, te vergelijken en te bewaren. De notities dienen als input
            voor de artikelen, afleveringen en content die op VinoVonk.com
            verschijnen.
          </p>
        </div>
      </section>

      {/* SAT-methode */}
      <section aria-labelledby="over-sat">
        <h2
          id="over-sat"
          className="text-xs font-bold tracking-widest uppercase text-muted-foreground border-l-[3px] border-l-primary pl-2 mb-4"
        >
          De methode — wijn
        </h2>
        <div className="flex gap-4 mb-3">
          <div className="mt-0.5 shrink-0">
            <GlassWater className="h-5 w-5 text-primary/60" aria-hidden="true" />
          </div>
          <div className="space-y-2 text-base text-foreground/85 leading-relaxed">
            <p>
              Voor wijn wordt de{" "}
              <strong className="text-foreground">
                SAT-methode (Systematic Approach to Tasting)
              </strong>{" "}
              gebruikt — een gestructureerde aanpak die waarnemingen indeelt in
              verschijning, neus, gehemelte en conclusie.
            </p>
            <p>
              De SAT beschrijft in objectieve, herhaalbare termen: van
              helderheid en kleurintensiteit tot zuurgraad, tannine, body en
              rijpingspotentieel. Het resultaat is een volledig, reproduceerbaar
              smaakprofiel.
            </p>
          </div>
        </div>
      </section>

      {/* CIVC-methode */}
      <section aria-labelledby="over-civc">
        <h2
          id="over-civc"
          className="text-xs font-bold tracking-widest uppercase text-muted-foreground border-l-[3px] border-l-primary pl-2 mb-4"
        >
          De methode — champagne
        </h2>
        <div className="flex gap-4 mb-3">
          <div className="mt-0.5 shrink-0">
            <Sparkles className="h-5 w-5 text-primary/60" aria-hidden="true" />
          </div>
          <div className="space-y-2 text-base text-foreground/85 leading-relaxed">
            <p>
              Voor champagne volgt de app de proefmethode van het{" "}
              <strong className="text-foreground">
                CIVC (Comité Interprofessionnel du Vin de Champagne)
              </strong>
              . Deze methode is specifiek ontwikkeld voor mousserende wijnen en
              besteedt aandacht aan perlage, mousse, autolytische aroma&apos;s
              en dosage.
            </p>
            <p>
              De CIVC-aanpak vult de SAT aan met champagne-specifieke
              parameters die elders niet of nauwelijks worden gedekt.
            </p>
          </div>
        </div>
      </section>

      {/* Score */}
      <section aria-labelledby="over-score">
        <h2
          id="over-score"
          className="text-xs font-bold tracking-widest uppercase text-muted-foreground border-l-[3px] border-l-primary pl-2 mb-4"
        >
          De score — 1 tot 10
        </h2>
        <div className="flex gap-4 mb-3">
          <div className="mt-0.5 shrink-0">
            <Star className="h-5 w-5 text-primary/60" aria-hidden="true" />
          </div>
          <div className="space-y-2 text-base text-foreground/85 leading-relaxed">
            <p>
              Elke proefnotitie kan worden afgesloten met een persoonlijke score
              op een schaal van{" "}
              <strong className="text-foreground">1 tot 10</strong>. Dit is een
              subjectief eindoordeel — los van de objectieve SAT- of
              CIVC-analyse.
            </p>
            <p>
              De score is optioneel en bedoeld als snelle referentie bij het
              terugkijken of schrijven. Een <strong className="text-foreground">7</strong> is
              goed, een <strong className="text-foreground">9</strong> is
              uitzonderlijk. De score wordt meegenomen in de Markdown-export en
              het Review-schema voor publicatie op VinoVonk.com.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy & data */}
      <section aria-labelledby="over-data">
        <h2
          id="over-data"
          className="text-xs font-bold tracking-widest uppercase text-muted-foreground border-l-[3px] border-l-primary pl-2 mb-4"
        >
          Privacy &amp; data
        </h2>
        <div className="flex gap-4">
          <div className="mt-0.5 shrink-0">
            <BookOpen className="h-5 w-5 text-primary/60" aria-hidden="true" />
          </div>
          <div className="space-y-2 text-base text-foreground/85 leading-relaxed">
            <p>
              Alle data blijft in je browser — er is geen server, geen account
              en geen cloud-opslag. Notities, foto&apos;s en sessies worden
              lokaal opgeslagen via{" "}
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">
                localStorage
              </code>{" "}
              en verlaten het apparaat nooit.
            </p>
            <p>
              De app werkt volledig offline na de eerste keer laden.
            </p>
          </div>
        </div>
      </section>

      {/* Link naar site */}
      <div className="pt-2 border-t">
        <a
          href="https://vinovonk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-75 transition-opacity"
          aria-label="Ga naar VinoVonk.com (opent in nieuw tabblad)"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          VinoVonk.com
        </a>
      </div>

    </div>
  );
}
