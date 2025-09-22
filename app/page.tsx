import { RaffleHero } from "@/components/raffle-hero"
import { PrizeSection } from "@/components/prize-section"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#323232]">
      <RaffleHero />
      <PrizeSection />
    </main>
  )
}
