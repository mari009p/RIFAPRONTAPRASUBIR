import { type NextRequest, NextResponse } from "next/server"
import { LiraPayAPI } from "@/lib/lirapay"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const transactionId = params.id

    if (!transactionId) {
      return NextResponse.json({ error: "ID da transação não fornecido" }, { status: 400 })
    }

    const apiSecret = process.env.LIRAPAY_API_SECRET
    if (!apiSecret) {
      return NextResponse.json({ error: "Configuração de pagamento não encontrada" }, { status: 500 })
    }

    const liraPay = new LiraPayAPI(apiSecret)
    const transaction = await liraPay.getTransaction(transactionId)

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        external_id: transaction.external_id,
        status: transaction.status,
        amount: transaction.amount,
        customer: {
          name: transaction.customer.name,
          email: transaction.customer.email,
        },
        created_at: transaction.created_at,
      },
    })
  } catch (error) {
    console.error("Erro ao consultar transação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
