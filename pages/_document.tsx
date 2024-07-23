import { Html, Head, Main, NextScript } from "next/document";
import { spaceGrotesk, rajdhani, majorMonoDisplay } from "@/lib/fonts";
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={`${spaceGrotesk} ${rajdhani} ${majorMonoDisplay}`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
