import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artiklar",
  description:
    "Datadriven analys av den svenska begagnatmarknaden. Modellguider, jämförelser och marknadsanalyser baserade på över 10 000 Blocket-annonser.",
  openGraph: {
    title: "Artiklar | Hela Notan",
    description:
      "Datadriven analys av den svenska begagnatmarknaden. Modellguider, jämförelser och marknadsanalyser.",
  },
  alternates: {
    canonical: "https://helanotan.se/artiklar",
  },
};

export default function ArtiklerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
