import type { Metadata } from "next";
import Game from "@/components/Game";

export const metadata: Metadata = {
  title: "How Is Our Son A Banana?",
  description: "A telenovela-meets-true-crime visual novel. Play as Strawberrina navigating drama, secrets, and family chaos.",
};

export default function Home() {
  return <Game />;
}
