import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


export function resolveAssetPath(path: string): string {
    return path
        .replace(/^(\.\/)?assets\/images\//, "/images/")
        .replace(/^\/src\/assets\/images\//, "/images/");
}