"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Clock, CheckCircle, Copy, Check, QrCode, Smartphone } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface CustomerData {
  name: string
  email: string
  phone: string
  document: string
}

interface TransactionData {
  id: string
  external_id: string
  status: string
  pix_payload: string
  total_value: number
}

const generateQRCode = (pixPayload: string) => {
  // Using a QR code service to generate the QR code image
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixPayload)}`
}

export function CheckoutModal({ isOpen, onClose, quantity, unitPrice, totalPrice }: CheckoutModalProps) {
  const [step, setStep] = useState<"form" | "payment" | "success">("form")
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
    document: "",
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<CustomerData>>({})
  const [transaction, setTransaction] = useState<TransactionData | null>(null)
  const [pixCopied, setPixCopied] = useState(false)

  const validateForm = () => {
    const newErrors: Partial<CustomerData> = {}

    if (!customerData.name.trim()) newErrors.name = "Nome é obrigatório"
    if (!customerData.email.trim()) newErrors.email = "Email é obrigatório"
    if (!customerData.email.includes("@")) newErrors.email = "Email inválido"
    if (!customerData.phone.trim()) newErrors.phone = "Telefone é obrigatório"
    if (!customerData.document.trim()) newErrors.document = "CPF é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm() || !acceptTerms) return

    setLoading(true)
    try {
      console.log("[v0] Enviando dados para checkout:", {
        customer: customerData,
        quantity,
        unitPrice,
        totalAmount: Number.parseFloat(totalPrice.toString()),
      })

      const response = await fetch("/api/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: customerData,
          quantity,
          unitPrice,
          totalAmount: Number.parseFloat(totalPrice.toString()),
        }),
      })

      const data = await response.json()
      console.log("[v0] Resposta da API:", data)

      if (data.success) {
        setTransaction(data.transaction)
        setStep("payment")
        // Iniciar polling para verificar status do pagamento
        startPaymentPolling(data.transaction.id)
      } else {
        console.error("[v0] Erro na resposta:", data)
        throw new Error(data.error || "Erro ao criar transação")
      }
    } catch (error) {
      console.error("[v0] Erro no checkout:", error)
      alert("Erro ao processar pagamento. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const startPaymentPolling = (transactionId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-transaction/${transactionId}`)
        const data = await response.json()

        if (data.success && data.transaction.status === "AUTHORIZED") {
          clearInterval(pollInterval)
          setStep("success")
        }
      } catch (error) {
        console.error("Erro ao verificar status:", error)
      }
    }, 3000) // Verificar a cada 3 segundos

    // Limpar polling após 15 minutos
    setTimeout(() => clearInterval(pollInterval), 15 * 60 * 1000)
  }

  const copyPixCode = async () => {
    if (transaction?.pix_payload) {
      try {
        await navigator.clipboard.writeText(transaction.pix_payload)
        setPixCopied(true)
        setTimeout(() => setPixCopied(false), 2000)
      } catch (err) {
        console.error("Erro ao copiar código PIX:", err)
      }
    }
  }

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            {step === "form" && "Finalizar Compra"}
            {step === "payment" && "Pagamento PIX"}
            {step === "success" && "Compra Realizada!"}
          </DialogTitle>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-6">
            {/* Resumo do pedido */}
            <Card className="bg-card/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Números selecionados:</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Preço unitário:</span>
                  <span className="font-semibold">R$ {unitPrice.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-primary text-lg">R$ {totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Formulário de dados */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={customerData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={customerData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={customerData.phone}
                  onChange={(e) => handleInputChange("phone", formatPhone(e.target.value))}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">CPF *</Label>
                <Input
                  id="document"
                  placeholder="000.000.000-00"
                  value={customerData.document}
                  onChange={(e) => handleInputChange("document", formatCPF(e.target.value))}
                  className={errors.document ? "border-destructive" : ""}
                />
                {errors.document && <p className="text-xs text-destructive">{errors.document}</p>}
              </div>
            </div>

            {/* Termos e condições */}
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" checked={acceptTerms} onCheckedChange={setAcceptTerms} />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                Aceito os{" "}
                <button type="button" className="text-primary hover:underline">
                  termos e condições
                </button>{" "}
                e autorizo o processamento dos meus dados pessoais.
              </Label>
            </div>

            {/* Informações de segurança */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Seus dados estão protegidos com criptografia SSL. Pagamento 100% seguro via PIX.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleSubmit}
              disabled={!acceptTerms || loading}
              className="w-full h-12 text-lg font-semibold raffle-gradient"
            >
              {loading ? "Processando..." : "Continuar para Pagamento"}
            </Button>
          </div>
        )}

        {step === "payment" && transaction && (
          <div className="space-y-6">
            {/* QR Code PIX (placeholder) */}
            <div className="text-center space-y-4">
              <div className="payment-qr-container p-6 rounded-xl mx-auto w-fit">
                <div className="bg-white p-4 rounded-lg shadow-inner">
                  {transaction.pix_payload ? (
                    <img
                      src={generateQRCode(transaction.pix_payload) || "/placeholder.svg"}
                      alt="QR Code PIX"
                      className="w-48 h-48 mx-auto"
                      onError={(e) => {
                        // Fallback if QR code service fails
                        e.currentTarget.style.display = "none"
                        e.currentTarget.nextElementSibling?.classList.remove("hidden")
                      }}
                    />
                  ) : null}
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 hidden">
                    <QrCode className="h-16 w-16 mb-2" />
                    <span className="text-sm">QR Code PIX</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-lg text-foreground">Escaneie o QR Code</h3>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Abra o app do seu banco e escaneie o código
                </p>
              </div>
            </div>

            {/* Código PIX copiável */}
            <Card className="border-2 border-primary/20 bg-card">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">Código PIX:</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyPixCode}
                    className="h-8 px-3 bg-primary/10 border-primary/30 hover:bg-primary/20"
                  >
                    {pixCopied ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
                <div className="text-xs font-mono bg-background p-3 rounded-lg border break-all text-foreground">
                  {transaction.pix_payload}
                </div>
              </CardContent>
            </Card>

            {/* Status do pagamento */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-primary mb-2">
                  <Clock className="h-5 w-5 animate-pulse" />
                  <span className="font-medium">Aguardando pagamento...</span>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">R$ {transaction.total_value.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Pagamento será confirmado automaticamente</div>
              </CardContent>
            </Card>

            {/* Botão de confirmação */}
            <Button
              className="w-full h-12 text-lg font-bold confirm-payment-btn text-primary-foreground"
              onClick={() => {
                // This could trigger a manual check or show instructions
                alert("Continue aguardando a confirmação automática do pagamento via PIX.")
              }}
            >
              Confirmar Pagamento
            </Button>

            {/* Instruções */}
            <div className="bg-card/50 p-4 rounded-lg">
              <div className="text-xs text-card-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>O pagamento será confirmado automaticamente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Seus números serão reservados por 15 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Você receberá um email de confirmação</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-green-500">Pagamento Confirmado!</h3>
              <p className="text-muted-foreground">Seus números foram reservados com sucesso</p>
            </div>

            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Números reservados:</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Valor pago:</span>
                  <span className="font-semibold">R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Email de confirmação:</span>
                  <span className="font-semibold text-xs">{customerData.email}</span>
                </div>
              </CardContent>
            </Card>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>✓ Comprovante enviado por email</p>
              <p>✓ Números adicionados ao sorteio</p>
              <p>✓ Entre no grupo do WhatsApp para acompanhar</p>
            </div>

            <Button onClick={onClose} className="w-full raffle-gradient">
              Finalizar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
