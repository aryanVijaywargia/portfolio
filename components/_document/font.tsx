import { FC } from "react";

export const Font: FC = ({}) => {
  return (
    <>
      <link
        as="font"
        crossOrigin="anonymous"
        href="/fonts/inter-var-latin.woff2"
        rel="preload"
        type="font/woff2"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </>
  );
};
