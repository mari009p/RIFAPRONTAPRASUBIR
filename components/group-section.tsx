"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MessageCircle, Share2, Bell, Copy, Check } from "lucide-react"
import { useState } from "react"

export function GroupSection() {
  const [copied, setCopied] = useState(false)
  const groupLink = "https://chat.whatsapp.com/exemplo-grupo-rifa"

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(groupLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Erro ao copiar:", err)
    }
  }

  return (
    <section className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">📱 Grupo Oficial da Rifa</h2>
        <p className="text-muted-foreground text-lg">Participe do nosso grupo e fique por dentro de tudo!</p>
      </div>

      <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-green-500/20">
              <MessageCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">WhatsApp Oficial</CardTitle>
          <p className="text-muted-foreground">Entre no grupo e receba todas as atualizações em primeira mão</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Benefícios do grupo */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-semibold text-sm">Sorteios ao Vivo</h4>
                <p className="text-xs text-muted-foreground">Acompanhe em tempo real</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-semibold text-sm">Comunidade Ativa</h4>
                <p className="text-xs text-muted-foreground">Mais de 5.000 membros</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
              <Share2 className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-semibold text-sm">Promoções Exclusivas</h4>
                <p className="text-xs text-muted-foreground">Só para membros do grupo</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-semibold text-sm">Suporte Direto</h4>
                <p className="text-xs text-muted-foreground">Tire suas dúvidas rapidamente</p>
              </div>
            </div>
          </div>

          {/* Link do grupo */}
          <div className="bg-card/30 p-4 rounded-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1">Link do Grupo:</p>
                <p className="text-xs text-muted-foreground truncate">{groupLink}</p>
              </div>
              <Button size="sm" variant="outline" onClick={copyToClipboard} className="shrink-0 bg-transparent">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              onClick={() => window.open(groupLink, "_blank")}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Entrar no Grupo
            </Button>
            <Button size="lg" variant="outline" className="flex-1 bg-transparent" onClick={copyToClipboard}>
              <Share2 className="mr-2 h-5 w-5" />
              Compartilhar Link
            </Button>
          </div>

          {/* Status do grupo */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Online agora</span>
            </div>
            <Badge variant="secondary">5.247 membros</Badge>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
