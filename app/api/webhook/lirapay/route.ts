import { type NextRequest, NextResponse } from "next/server"

interface WebhookPayload {
  id: string
  external_id: string
  total_amount: number
  status: "AUTHORIZED" | "PENDING" | "CHARGEBACK" | "FAILED" | "IN_DISPUTE"
  payment_method: string
}

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json()

    console.log("Webhook recebido:", payload)

    // Aqui você pode implementar a lógica para:
    // 1. Atualizar o status da transação no banco de dados
    // 2. Enviar email de confirmação para o cliente
    // 3. Reservar os números da rifa
    // 4. Notificar outros sistemas

    switch (payload.status) {
      case "AUTHORIZED":
        console.log(`Pagamento aprovado para transação ${payload.id}`)
        // Implementar lógica de aprovação
        break

      case "FAILED":
        console.log(`Pagamento falhou para transação ${payload.id}`)
        // Implementar lógica de falha
        break

      case "PENDING":
        console.log(`Pagamento pendente para transação ${payload.id}`)
        // Implementar lógica de pendência
        break

      default:
        console.log(`Status desconhecido: ${payload.status}`)
    }

    // Sempre retornar 200 para confirmar recebimento
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Erro no webhook:", error)
    return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 500 })
  }
}
