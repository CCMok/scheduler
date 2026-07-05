"use client"

import React, { useMemo } from "react"

import { cn } from "@/external/shadcn/libs/utils"

interface MeteorsProps {
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
  className?: string
}

export const Meteors = ({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) => {
  const seededUnit = (index: number, salt: number) => {
    const x = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453
    return x - Math.floor(x)
  }

  const meteorStyles = useMemo<Array<React.CSSProperties>>(
    () =>
      [...new Array(number)].map((_, index) => {
        const leftPercent = Math.floor(seededUnit(index, angle) * 100)
        const delay = seededUnit(index, minDelay + maxDelay)
        const duration = seededUnit(index, minDuration + maxDuration)
        return {
          "--angle": -angle + "deg",
          top: "-5%",
          left: `${leftPercent}%`,
          animationDelay: delay * (maxDelay - minDelay) + minDelay + "s",
          animationDuration:
            Math.floor(duration * (maxDuration - minDuration) + minDuration) +
            "s",
        }
      }),
    [number, minDelay, maxDelay, minDuration, maxDuration, angle]
  )

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        // Meteor Head
        <span
          key={idx}
          style={{ ...style }}
          className={cn(
            "animate-meteor pointer-events-none absolute size-0.5 rotate-[var(--angle)] rounded-full bg-zinc-500 shadow-[0_0_0_1px_#ffffff10]",
            className
          )}
        >
          {/* Meteor Tail */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-zinc-500 to-transparent" />
        </span>
      ))}
    </>
  )
}
