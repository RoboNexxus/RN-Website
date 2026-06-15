"use client"

import React, { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

interface MeteorsProps {
  className?: string
}

/**
 * Meteors background animation component
 * Renders 49 animated meteors with randomized positions and timing
 */
export const Meteors = ({ className }: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([])

  useEffect(() => {
    const number = 49
    const minDelay = 0.2
    const maxDelay = 1.2
    const minDuration = 2
    const maxDuration = 12
    const angle = 222

    const styles = [...new Array(number)].map(() => ({
      "--angle": -angle + "deg",
      top: "-5%",
      left: `calc(0% + ${Math.floor(Math.random() * window.innerWidth)}px)`,
      animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
      animationDuration:
        Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) +
        "s",
    }))
    setMeteorStyles(styles)
  }, [])

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        // Meteor Head
        <span
          key={idx}
          style={{ ...style }}
          className={cn(
            "animate-meteor pointer-events-none absolute size-0.5 rotate-(--angle) rounded-full bg-zinc-500 shadow-[0_0_0_1px_#ffffff10]",
            className
          )}
        >
          {/* Meteor Tail */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-12.5 -translate-y-1/2 bg-linear-to-r from-zinc-500 to-transparent" />
        </span>
      ))}
    </>
  )
}
