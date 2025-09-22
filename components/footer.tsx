"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Award, MessageCircle, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card/30 border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Seção de confiança */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center bg-transparent border-none shadow-none">
            <CardContent className="p-6">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">100% Seguro</h3>
              <p className="text-sm text-muted-foreground">
                Pagamentos protegidos com criptografia SSL e processamento via PIX
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-transparent border-none shadow-none">
            <CardContent className="p-6">
              <Award className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Prêmios Garantidos</h3>
              <p className="text-sm text-muted-foreground">
                Mais de R$ 50.000 em prêmios distribuídos com transparência total
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-transparent border-none shadow-none">
            <CardContent className="p-6">
              <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Dados Protegidos</h3>
              <p className="text-sm text-muted-foreground">Suas informações pessoais são protegidas conforme a LGPD</p>
            </CardContent>
          </Card>
        </div>

        {/* Informações de contato */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">Contato e Suporte</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span className="text-sm">WhatsApp: (11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">Email: contato@megarifa.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">Atendimento: Seg-Sex 9h às 18h</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Informações Importantes</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Sorteio realizado pela Loteria Federal</p>
              <p>• Números limitados: máximo 10.000</p>
              <p>• Resultado divulgado ao vivo no grupo</p>
              <p>• Prêmios pagos em até 48h após o sorteio</p>
            </div>
          </div>
        </div>

        {/* Links importantes */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button variant="link" className="text-xs text-muted-foreground p-0 h-auto">
            Termos de Uso
          </Button>
          <Button variant="link" className="text-xs text-muted-foreground p-0 h-auto">
            Política de Privacidade
          </Button>
          <Button variant="link" className="text-xs text-muted-foreground p-0 h-auto">
            Regulamento da Rifa
          </Button>
          <Button variant="link" className="text-xs text-muted-foreground p-0 h-auto">
            Como Funciona
          </Button>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">© 2025 Mega Rifa Premiada. Todos os direitos reservados.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Este site utiliza cookies para melhorar sua experiência de navegação.
          </p>
        </div>
      </div>
    </footer>
  )
}
