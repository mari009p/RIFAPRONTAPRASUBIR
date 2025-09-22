"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Zap, Crown, Star, Gift } from "lucide-react"

interface PromotionTier {
  range: string
  price: number
  originalPrice?: number
  discount?: string
  icon: React.ReactNode
  popular?: boolean
  description: string
  minQuantity: number
}

const promotionTiers: PromotionTier[] = [
  {
    range: "1-100",
    price: 2.0,
    icon: <Gift className="h-5 w-5" />,
    description: "Ideal para começar",
    minQuantity: 1,
  },
  {
    range: "100-500",
    price: 1.5,
    originalPrice: 2.0,
    discount: "25% OFF",
    icon: <Star className="h-5 w-5" />,
    description: "Boa economia",
    minQuantity: 100,
  },
  {
    range: "500-1000",
    price: 1.25,
    originalPrice: 2.0,
    discount: "37% OFF",
    icon: <TrendingUp className="h-5 w-5" />,
    popular: true,
    description: "Mais vendida",
    minQuantity: 500,
  },
  {
    range: "1000-5000",
    price: 1.0,
    originalPrice: 2.0,
    discount: "50% OFF",
    icon: <Zap className="h-5 w-5" />,
    description: "Super desconto",
    minQuantity: 1000,
  },
  {
    range: "5000-10000",
    price: 0.6,
    originalPrice: 2.0,
    discount: "70% OFF",
    icon: <Crown className="h-5 w-5" />,
    description: "Melhor oferta",
    minQuantity: 5000,
  },
]

interface PromotionTiersProps {
  onSelectTier?: (minQuantity: number, price: number) => void
}

export function PromotionTiers({ onSelectTier }: PromotionTiersProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleTierSelect = (minQuantity: number, price: number) => {
    scrollToTop()
    // Pequeno delay para permitir o scroll antes de executar a callback
    setTimeout(() => {
      onSelectTier?.(minQuantity, price)
    }, 500)
  }

  return (
    <section className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">🔥 Promoções Especiais</h2>
        <p className="text-muted-foreground text-lg">Quanto mais números você comprar, maior será seu desconto!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {promotionTiers.map((tier, index) => (
          <Card
            key={index}
            className={`relative transition-all duration-300 hover:scale-105 cursor-pointer ${
              tier.popular ? "ring-2 ring-primary shadow-lg prize-glow" : "hover:shadow-md"
            }`}
            onClick={() => handleTierSelect(tier.minQuantity, tier.price)}
          >
            {tier.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-secondary text-secondary-foreground">
                MAIS VENDIDA
              </Badge>
            )}

            <CardHeader className="pb-3">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 rounded-full bg-primary/20 text-primary">{tier.icon}</div>
              </div>
              <CardTitle className="text-center text-sm font-medium">{tier.range} números</CardTitle>
            </CardHeader>

            <CardContent className="pt-0 text-center">
              <div className="mb-3">
                {tier.originalPrice && (
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-sm text-muted-foreground line-through">
                      R$ {tier.originalPrice.toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      {tier.discount}
                    </Badge>
                  </div>
                )}
                <div className="text-2xl font-bold text-primary">R$ {tier.price.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">por número</div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>

              <Button
                size="sm"
                variant={tier.popular ? "default" : "outline"}
                className={`w-full ${tier.popular ? "raffle-gradient" : ""}`}
              >
                Selecionar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Seção de benefícios */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Descontos Progressivos</h3>
            <p className="text-sm text-muted-foreground">Quanto mais números, maior o desconto. Economize até 70%!</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Compra Instantânea</h3>
            <p className="text-sm text-muted-foreground">
              Processo rápido e seguro. Seus números são reservados na hora!
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Crown className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Prêmios Garantidos</h3>
            <p className="text-sm text-muted-foreground">
              Múltiplos ganhadores! Mais chances de ganhar prêmios incríveis.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
