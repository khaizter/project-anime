import { Space_Grotesk, Rajdhani, Major_Mono_Display } from "next/font/google";

const spaceGroteskInit = Space_Grotesk({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-space-grotesk",
});

const rajdhaniInit = Rajdhani({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rajdhani",
});

const majorMonoDisplayInit = Major_Mono_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-major-mono-display",
});

export const spaceGrotesk = spaceGroteskInit.variable;
export const rajdhani = rajdhaniInit.variable;
export const majorMonoDisplay = majorMonoDisplayInit.variable;
