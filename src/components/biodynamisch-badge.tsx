'use client';

import { getBiodynamischInfo, getMaanTekenWisselTijden, BiodynamischDagType } from '@/lib/biodynamisch';

interface BiodynamischBadgeProps {
  // Geef ofwel een dagType op (voor opgeslagen sessies) ofwel een datum (voor live berekening)
  dagType?: BiodynamischDagType;
  datum?: Date | string;
  // compact = kleine badge voor lijsten; uitgebreid = kaart voor dashboard
  variant?: 'compact' | 'uitgebreid';
}

export function BiodynamischBadge({
  dagType,
  datum,
  variant = 'compact',
}: BiodynamischBadgeProps) {
  // Bereken info op basis van datum of dagType
  const resolvedDatum = datum
    ? typeof datum === 'string'
      ? new Date(datum + 'T12:00:00') // Gebruik middag om tijdzone-rand te vermijden
      : datum
    : new Date();

  const info = getBiodynamischInfo(resolvedDatum);

  // Als dagType opgegeven is, gebruik die (voor historische sessies met opgeslagen waarde)
  const effectiefDagType = dagType ?? info.dagType;
  const effectiefInfo = dagType
    ? { ...info, dagType: effectiefDagType }
    : info;

  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${effectiefInfo.kleur}`}
        title={`${effectiefInfo.label} — ${effectiefInfo.sterrenbeeld} (${effectiefInfo.element})`}
      >
        <span>{effectiefInfo.emoji}</span>
        <span>{effectiefInfo.label}</span>
      </span>
    );
  }

  // Uitgebreide variant voor het dashboard
  const datumGeformatteerd = resolvedDatum.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const tijdOpties: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  const wisselTijden = getMaanTekenWisselTijden(resolvedDatum);
  const eindTijd = wisselTijden.eind.toLocaleTimeString('nl-NL', tijdOpties);
  const eindDatum = wisselTijden.eind.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' });
  const zelfdedag = wisselTijden.eind.toDateString() === resolvedDatum.toDateString();
  const tijdRange = zelfdedag
    ? `tot ${eindTijd}`
    : `tot ${eindTijd} op ${eindDatum}`;

  return (
    <div className={`rounded-xl border-2 px-5 py-4 ${effectiefInfo.kleur}`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none mt-0.5">{effectiefInfo.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm mb-0.5 capitalize">{datumGeformatteerd}</p>
          <p className="text-sm font-semibold mb-0.5">{effectiefInfo.label}</p>
          <p className="text-sm mb-2">
            Maan in {effectiefInfo.sterrenbeeld} · {effectiefInfo.element} · {tijdRange}
          </p>
          <p className="text-sm mb-0.5">{effectiefInfo.beschrijving}</p>
          <p className="text-sm font-medium">{effectiefInfo.aanbeveling}</p>
        </div>
      </div>
      <p className="mt-3 text-sm border-t border-current/20 pt-2">
        Biodynamische kalender · berekend op basis van maanpositie (Maria Thun methode)
      </p>
    </div>
  );
}
