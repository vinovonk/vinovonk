"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number; // 0-5 (met 0.5 stappen)
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
  showValue = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const iconSize = sizeClasses[size];
  const displayValue = hoverValue ?? value;

  const handleClick = (starIndex: number, isHalf: boolean) => {
    if (readonly || !onChange) return;
    const newValue = starIndex + (isHalf ? 0.5 : 1);
    onChange(newValue);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLButtonElement>,
    starIndex: number
  ) => {
    if (readonly || !onChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setHoverValue(starIndex + (isHalf ? 0.5 : 1));
  };

  const getStarFill = (starIndex: number) => {
    const fillValue = displayValue - starIndex;
    if (fillValue >= 1) return "full";
    if (fillValue >= 0.5) return "half";
    return "empty";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((starIndex) => {
          const fillType = getStarFill(starIndex);

          return (
            <button
              key={starIndex}
              type="button"
              disabled={readonly}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const isHalf = x < rect.width / 2;
                handleClick(starIndex, isHalf);
              }}
              onMouseMove={(e) => handleMouseMove(e, starIndex)}
              onMouseLeave={() => setHoverValue(null)}
              className={`relative transition-transform ${
                !readonly && "hover:scale-110 cursor-pointer"
              } ${readonly && "cursor-default"}`}
            >
              {fillType === "full" ? (
                <Star
                  className={`${iconSize} fill-yellow-400 text-yellow-400`}
                />
              ) : fillType === "half" ? (
                <div className="relative">
                  <Star className={`${iconSize} text-muted-foreground/30`} />
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <Star
                      className={`${iconSize} fill-yellow-400 text-yellow-400`}
                    />
                  </div>
                </div>
              ) : (
                <Star className={`${iconSize} text-muted-foreground/30`} />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground font-medium min-w-[3ch]">
          {displayValue.toFixed(1)}
        </span>
      )}
    </div>
  );
}
