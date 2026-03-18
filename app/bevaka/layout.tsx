import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bevaka din bil — Se vad den tappar i värde | Hela Notan",
  description: "Välj din bil och se hur den tappar i värde. Få månatliga uppdateringar med marknadsvärde och värdeminskning.",
  openGraph: {
    title: "Bevaka din bil | Hela Notan",
    description: "Se vad din bil tappar i värde varje månad.",
  },
};

export default function BevakaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
