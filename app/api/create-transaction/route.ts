import { type NextRequest, NextResponse } from "next/server"
import { LiraPayAPI, generateExternalId, getClientIP, formatCustomerData } from "@/lib/lirapay"

interface CreateTransactionBody {
  customer: {
    name: string
    email: string
    phone: string
    document: string
  }
  quantity: number
  unitPrice: number
  totalAmount: number
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTransactionBody = await request.json()

    console.log("[v0] Dados recebidos:", body)

    // Validação básica
    if (!body.customer || !body.quantity || !body.unitPrice || !body.totalAmount) {
      console.log("[v0] Erro: Dados obrigatórios não fornecidos")
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    if (!body.customer.name || !body.customer.email || !body.customer.phone || !body.customer.document) {
      console.log("[v0] Erro: Dados do cliente incompletos")
      return NextResponse.json({ error: "Dados do cliente incompletos" }, { status: 400 })
    }

    // Verificar se API_SECRET está configurado
    const apiSecret = process.env.LIRAPAY_API_SECRET
    if (!apiSecret) {
      console.error("[v0] LIRAPAY_API_SECRET não configurado")
      return NextResponse.json({ error: "Configuração de pagamento não encontrada" }, { status: 500 })
    }

    console.log("[v0] Iniciando criação de transação...")

    const liraPay = new LiraPayAPI(apiSecret)
    const externalId = generateExternalId()
    const clientIP = getClientIP(request)

    // URL do webhook para receber atualizações de status
    const webhookUrl = "https://webhook.site/unique-id-placeholder"

    const calculatedTotal = body.quantity * body.unitPrice
    if (Math.abs(calculatedTotal - body.totalAmount) > 0.01) {
      console.log("[v0] Erro: Valor total não confere com quantidade x preço unitário")
      return NextResponse.json({ error: "Valor total incorreto" }, { status: 400 })
    }

    const transactionData = {
      external_id: externalId,
      total_amount: body.totalAmount,
      payment_method: "PIX" as const,
      webhook_url: webhookUrl,
      items: [
        {
          id: "rifa_numbers",
          title: `${body.quantity} Números da Rifa`,
          description: `Participação na rifa com ${body.quantity} números`,
          price: body.unitPrice,
          quantity: body.quantity,
          is_physical: false,
        },
      ],
      ip: clientIP,
      customer: formatCustomerData(body.customer),
    }

    console.log("[v0] Dados da transação:", JSON.stringify(transactionData, null, 2))

    const transaction = await liraPay.createTransaction(transactionData)

    console.log("[v0] Transação criada com sucesso:", transaction.id)

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        external_id: transaction.external_id,
        status: transaction.status,
        pix_payload: transaction.pix.payload,
        total_value: transaction.total_value,
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao criar transação:", error)
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    return NextResponse.json(
      {
        error: "Erro ao processar pagamento",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
