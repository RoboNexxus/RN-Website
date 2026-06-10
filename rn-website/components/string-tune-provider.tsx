"use client";

import { useEffect } from "react";
import { StringTune, StringSplit, StringProgress } from "@fiddle-digital/string-tune";

/**
 * Initializes StringTune once on the client with:
 *  - StringSplit  → splits [string="split"] elements into chars/words
 *  - StringProgress → tracks scroll progress on [string="progress"] elements,
 *                     exposing --progress as a CSS variable
 *
 * Must be rendered inside a Client Component tree (layout body).
 */
export default function StringTuneProvider() {
  useEffect(() => {
    const tune = StringTune.getInstance();

    tune.use(StringSplit);
    tune.use(StringProgress);

    tune.start(60);

    return () => {
      tune.destroy();
    };
  }, []);

  return null;
}
