import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


const cloudinaryMap: Record<string, string> = {
  "2f4u_v1.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/b6wndflujhyhqg7ta6az?_a=BAMAPqfk0",
  "2f4u_v2.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/raz1zjnubsmrxw95zjse?_a=BAMAPqfk0",
  "AKSY.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/xx9ygn2xdm1mo5rbe3cp?_a=BAMAPqfk0",
  "AM.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/y2vdshtz5znsahhecrzw?_a=BAMAPqfk0",
  "ARAY.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/odn5en9zteineej9b6hv?_a=BAMAPqfk0",
  "DY.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/r82eyg3wgveaui8nkyzv?_a=BAMAPqfk0",
  "RG.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/ijkqklfsdkxjloxnxw5n?_a=BAMAPqfk0",
  "Robo_Nexus_Logo.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/hh4pb5zrmventaz8mkfl?_a=BAMAPqfk0",
  "VD.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/vjavvyeteoz1dv24sa5f?_a=BAMAPqfk0",
  "ac.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/ersgsbvj0zpsgehm93dm?_a=BAMAPqfk0",
  "android-chrome-192x192.png": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/q5ornuzwfhdgipyn6gyk?_a=BAMAPqfk0",
  "android-chrome-512x512.png": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/ppmrdoncrldwqajh5em6?_a=BAMAPqfk0",
  "apple-touch-icon.png": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/fyuy9lmpsoot6pkxkgn0?_a=BAMAPqfk0",
  "favicon-16x16.png": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/tiqgdlr3adbes9vhuvvm?_a=BAMAPqfk0",
  "favicon-32x32.png": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/wkmctntcl85owyzfzoep?_a=BAMAPqfk0",
  "favicon.ico": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/edk0lpjus0anrenospj7?_a=BAMAPqfk0",
  "legacy.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/kpnu9ridnw470333hfrl?_a=BAMAPqfk0",
  "nk.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/qi1t3b6i1mrkodmx88qk?_a=BAMAPqfk0",
  "robonexus.png": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/nvbk67fewjqrf9ethsrp?_a=BAMAPqfk0",
  "yadavE.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/tj2wfsaskczyfjluc9zi?_a=BAMAPqfk0",
  "yadavE0.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/t75xo8duhqagacyvvfaw?_a=BAMAPqfk0",
  "yadavE07.webp": "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/bs4es2tdhvg6ouham1ns?_a=BAMAPqfk0"
};

export function resolveAssetPath(path: string): string {
    const filename = path.split('/').pop();
    if (filename && cloudinaryMap[filename]) {
        return cloudinaryMap[filename];
    }
    return path
        .replace(/^(\.\/)?assets\/images\//, "/images/")
        .replace(/^\/src\/assets\/images\//, "/images/");
}