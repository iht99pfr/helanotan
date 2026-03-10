import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ägandekostnadsberäknare",
  description:
    "Beräkna den totala ägandekostnaden för en bil. Jämför köp, värdeminskning, försäkring, skatt och service baserat på riktiga Blocket-annonser.",
  alternates: {
    canonical: "https://helanotan.se/tco",
  },
};

export default function TcoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
