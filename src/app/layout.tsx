import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ConditionalLayout } from "@/components/conditional-layout";
import { BackgroundLetters } from "@/components/background-letters";

export const metadata: Metadata = {
  title: "OSM - Outside Sport Management",
  description: "Platform for sports management and player development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://use.typekit.net/rma1qil.css" />
      </head>
      <body className="antialiased">
        <Providers>
          <BackgroundLetters />
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
