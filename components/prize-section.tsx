"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, ChevronDown, ChevronUp } from "lucide-react"

const prizeTiers = [
  {
    value: 10000,
    numbers: [
      { number: "4201001", sold: true },
      { number: "4201002", sold: false },
      { number: "4201003", sold: false },
    ],
  },
  {
    value: 1000,
    numbers: [
      { number: "4204001", sold: true },
      { number: "4204002", sold: true },
      { number: "4204003", sold: false },
      { number: "4204004", sold: false },
      { number: "4204005", sold: false },
      { number: "4204006", sold: false },
    ],
  },
  {
    value: 500,
    numbers: [
      { number: "4202001", sold: true },
      { number: "4202002", sold: true },
      { number: "4202003", sold: false },
      { number: "4202004", sold: false },
      { number: "4202005", sold: false },
      { number: "4202006", sold: false },
      { number: "4202007", sold: false },
      { number: "4202008", sold: false },
      { number: "4202009", sold: false },
      { number: "4202010", sold: false },
      { number: "4202011", sold: false },
      { number: "4202012", sold: false },
      { number: "4202013", sold: false },
      { number: "4202014", sold: false },
      { number: "4202015", sold: false },
    ],
  },
  {
    value: 250,
    numbers: [
      { number: "4203001", sold: true },
      { number: "4203002", sold: true },
      { number: "4203003", sold: true },
      { number: "4203004", sold: false },
      { number: "4203005", sold: false },
      { number: "4203006", sold: false },
      { number: "4203007", sold: false },
      { number: "4203008", sold: false },
      { number: "4203009", sold: false },
      { number: "4203010", sold: false },
      { number: "4203011", sold: false },
      { number: "4203012", sold: false },
      { number: "4203013", sold: false },
      { number: "4203014", sold: false },
      { number: "4203015", sold: false },
    ],
  },
]

const mainPrizeTiers = prizeTiers.filter((tier) => tier.value >= 1000)

export function PrizeSection() {
  const [activeTab, setActiveTab] = useState<"todas" | "disponiveis" | "compradas">("todas")
  const [showAllPrizes, setShowAllPrizes] = useState(false)

  const allPrizes = prizeTiers.flatMap((tier) => tier.numbers.map((item) => ({ ...item, value: tier.value })))
  const mainPrizes = mainPrizeTiers.flatMap((tier) => tier.numbers.map((item) => ({ ...item, value: tier.value })))
  const availablePrizes = allPrizes.filter((prize) => !prize.sold)
  const soldPrizes = allPrizes.filter((prize) => prize.sold)

  const getFilteredPrizes = () => {
    const prizesToShow = showAllPrizes ? allPrizes : mainPrizes
    switch (activeTab) {
      case "disponiveis":
        return prizesToShow.filter((prize) => !prize.sold)
      case "compradas":
        return prizesToShow.filter((prize) => prize.sold)
      default:
        return prizesToShow
    }
  }

  const filteredPrizes = getFilteredPrizes()

  return (
    <section className="px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 text-green-400" />
          <h2 className="text-white text-lg font-semibold">Títulos premiados</h2>
        </div>
      </div>

      <div className="text-gray-400 text-sm mb-4">
        {availablePrizes.length} disponíveis/{allPrizes.length} cotas
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => setActiveTab("todas")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeTab === "todas" ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-300 border border-gray-600"
          }`}
        >
          Todas
        </Button>
        <Button
          onClick={() => setActiveTab("disponiveis")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeTab === "disponiveis"
              ? "bg-orange-500 text-white"
              : "bg-gray-700 text-gray-300 border border-gray-600"
          }`}
        >
          Disponíveis
        </Button>
        <Button
          onClick={() => setActiveTab("compradas")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeTab === "compradas" ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-300 border border-gray-600"
          }`}
        >
          Compradas
        </Button>
      </div>

      <div className="space-y-3">
        {filteredPrizes.map((prize) => (
          <Card key={prize.number} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-white font-bold text-lg">R${prize.value.toLocaleString("pt-BR")},00</div>
                </div>
                <Badge
                  className={
                    prize.sold
                      ? "bg-red-600 hover:bg-red-700 text-white px-4 py-1"
                      : "bg-green-600 hover:bg-green-700 text-white px-4 py-1"
                  }
                >
                  {prize.sold ? "Comprada" : "Disponível"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Trophy className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 text-sm">{prize.number}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button
          variant="ghost"
          onClick={() => setShowAllPrizes(!showAllPrizes)}
          className="text-gray-400 hover:text-white flex items-center gap-2"
        >
          {showAllPrizes ? "Ver apenas principais" : "Ver todos os prêmios"}
          {showAllPrizes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
    </section>
  )
}
