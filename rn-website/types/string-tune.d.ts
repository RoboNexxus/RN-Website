/**
 * Augments React's HTML element attribute types so StringTune's
 * attribute-driven API (`string`, `string-split`, etc.) doesn't produce
 * TypeScript errors on standard HTML elements.
 */
import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    /** StringTune module key (e.g. "split", "progress", "parallax") */
    string?: string;
    /** StringSplit mode (e.g. "char", "word", "line") */
    "string-split"?: string;
    /** StringProgress / parallax top offset */
    "string-offset-top"?: string;
    /** StringProgress / parallax bottom offset */
    "string-offset-bottom"?: string;
    /** StringLerp factor */
    "string-lerp"?: string | number;
    /** StringParallax speed */
    "string-speed"?: string | number;
    /** StringCursor class */
    "string-cursor"?: string;
    /** StringMagnetic radius */
    "string-radius"?: string | number;
    /** Repeat animation on scroll leave */
    "string-repeat"?: string;
  }
}
