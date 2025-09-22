"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, AlertCircle } from "lucide-react"
import { CheckoutModal } from "@/components/checkout-modal"

export function RaffleHero() {
  const [quantity, setQuantity] = useState(5) // Quantidade mínima inicial de 5
  const [currentPrice, setCurrentPrice] = useState(1.99) // Voltando aos preços originais
  const [showCheckout, setShowCheckout] = useState(false)
  const [error, setError] = useState("") // Adicionando estado de erro

  const calculatePrice = (qty: number) => {
    if (qty >= 5000) return 0.99
    if (qty >= 1000) return 1.49
    if (qty >= 500) return 1.69
    if (qty >= 100) return 1.89
    return 1.99
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    })
  }

  const addQuantity = (amount: number) => {
    const newQuantity = quantity + amount
    if (newQuantity < 5) {
      setError("Quantidade mínima é de 5 números para cobrir as taxas de pagamento")
      return
    }
    setError("")
    setQuantity(newQuantity)
    setCurrentPrice(calculatePrice(newQuantity))
  }

  const selectPricingTier = (minQty: number) => {
    const finalQty = Math.max(minQty, 5)
    setQuantity(finalQty)
    setCurrentPrice(calculatePrice(finalQty))
    setError("")
  }

  const handleQuantityChange = (value: string) => {
    const newQuantity = Number.parseInt(value) || 5
    if (newQuantity < 5) {
      setError("Quantidade mínima é de 5 números para cobrir as taxas de pagamento")
      return
    }
    setError("")
    setQuantity(newQuantity)
    setCurrentPrice(calculatePrice(newQuantity))
  }

  const incrementQuantity = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    setCurrentPrice(calculatePrice(newQuantity))
    setError("")
  }

  const decrementQuantity = () => {
    if (quantity > 5) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      setCurrentPrice(calculatePrice(newQuantity))
      setError("")
    } else {
      setError("Quantidade mínima é de 5 números para cobrir as taxas de pagamento")
    }
  }

  const totalPrice = Number.parseFloat((quantity * currentPrice).toFixed(2))

  const handleCheckout = () => {
    if (quantity < 5) {
      setError("Quantidade mínima é de 5 números para cobrir as taxas de pagamento")
      return
    }
    if (totalPrice < 5) {
      setError("Valor mínimo é de R$ 5,00 para cobrir as taxas de pagamento")
      return
    }
    setShowCheckout(true)
  }

  return (
    <>
      <section className="px-4 py-6 max-w-md mx-auto">
        <div className="mb-6">
          <h2 className="text-white text-lg font-semibold mb-4">Escolha de Números</h2>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <Button
              variant="outline"
              onClick={() => addQuantity(5)}
              className="h-12 bg-gray-700 border-orange-500 text-white hover:bg-orange-500"
            >
              +5
            </Button>
            <Button
              onClick={() => addQuantity(10)}
              className="h-12 bg-orange-500 hover:bg-orange-600 text-white relative"
            >
              +10
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs px-1">Mais popular</Badge>
            </Button>
            <Button
              variant="outline"
              onClick={() => addQuantity(20)}
              className="h-12 bg-gray-700 border-orange-500 text-white hover:bg-orange-500"
            >
              +20
            </Button>
            <Button
              variant="outline"
              onClick={() => addQuantity(50)}
              className="h-12 bg-gray-700 border-orange-500 text-white hover:bg-orange-500"
            >
              +50
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              className="h-12 w-12 bg-gray-700 border-orange-500 text-white hover:bg-orange-500"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="5"
              max="10000"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="text-center text-xl font-bold bg-gray-700 border-orange-500 text-white h-12 flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              className="h-12 w-12 bg-gray-700 border-orange-500 text-white hover:bg-orange-500"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <div className="flex justify-between items-center mb-2">
            <span className="text-white">{quantity} Números</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-green-400 text-2xl font-bold">{formatPrice(totalPrice)}</span>
          </div>

          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white"
            onClick={handleCheckout}
          >
            Ir para pagamento
          </Button>
        </div>

        <div className="mb-6">
          <h3 className="text-white text-lg font-semibold mb-4">Tabela de Preços - Clique para Aplicar</h3>
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => selectPricingTier(5)}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 hover:border-orange-500 cursor-pointer transition-all duration-200 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-white text-sm mb-1">5 - 99 números</div>
                <div className="text-orange-400 font-bold text-lg">R$ 1,99 cada</div>
              </div>
            </div>

            <div
              onClick={() => selectPricingTier(100)}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 hover:border-orange-500 cursor-pointer transition-all duration-200 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-white text-sm mb-1">100 - 499 números</div>
                <div className="text-orange-400 font-bold text-lg">R$ 1,89 cada</div>
              </div>
            </div>

            <div
              onClick={() => selectPricingTier(500)}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 hover:border-orange-500 cursor-pointer transition-all duration-200 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-white text-sm mb-1">500 - 999 números</div>
                <div className="text-orange-400 font-bold text-lg">R$ 1,69 cada</div>
              </div>
            </div>

            <div
              onClick={() => selectPricingTier(1000)}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 hover:border-orange-500 cursor-pointer transition-all duration-200 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-white text-sm mb-1">1000 - 4999 números</div>
                <div className="text-orange-400 font-bold text-lg">R$ 1,49 cada</div>
              </div>
            </div>

            <div
              onClick={() => selectPricingTier(5000)}
              className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-4 border border-green-600 hover:border-green-400 cursor-pointer transition-all duration-200 hover:scale-105 col-span-2"
            >
              <div className="text-center">
                <div className="text-white text-base mb-1 font-semibold">5000+ Números</div>
                <div className="text-green-400 font-bold text-2xl">R$ 0,99 cada</div>
                <Badge className="mt-2 bg-green-600 text-white">Melhor Oferta!</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de checkout */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        quantity={quantity}
        unitPrice={currentPrice}
        totalPrice={totalPrice}
      />
    </>
  )
}
