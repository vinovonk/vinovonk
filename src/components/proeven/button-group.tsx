"use client";

import { cn } from "@/lib/utils";

interface ButtonGroupOption<T extends string> {
  waarde: T;
  label: string;
  hex?: string; // voor kleur chips
}

interface ButtonGroupProps<T extends string> {
  label: string;
  opties: ButtonGroupOption<T>[];
  waarde: T | null;
  onChange: (waarde: T) => void;
  size?: "sm" | "md";
  showColor?: boolean;
}

export function ButtonGroup<T extends string>({
  label,
  opties,
  waarde,
  onChange,
  size = "md",
  showColor = false,
}: ButtonGroupProps<T>) {
  return (
    <div className="space-y-2.5">
      <label className="text-base font-medium text-foreground">{label}</label>
      <div className="flex flex-wrap gap-2">
        {opties.map((optie) => (
          <button
            key={optie.waarde}
            type="button"
            onClick={() => onChange(optie.waarde)}
            className={cn(
              "rounded-md border font-medium transition-all min-h-[44px]",
              size === "sm" ? "px-3 py-2 text-sm" : "px-4 py-2.5 text-base",
              waarde === optie.waarde
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20"
            )}
          >
            {showColor && optie.hex && (
              <span
                className="inline-block w-4 h-4 rounded-full mr-2 border border-border/50"
                style={{ backgroundColor: optie.hex }}
              />
            )}
            {optie.label}
          </button>
        ))}
      </div>
    </div>
  );
}
