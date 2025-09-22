// Configuração e funções para integração com API LiraPay
const LIRAPAY_BASE_URL = "https://api.lirapaybr.com"

interface LiraPayCustomer {
  name: string
  email: string
  phone: string
  document_type: "CPF" | "CNPJ"
  document: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

interface LiraPayItem {
  id: string
  title: string
  description: string
  price: number
  quantity: number
  is_physical: boolean
}

interface CreateTransactionRequest {
  external_id: string
  total_amount: number
  payment_method: "PIX"
  webhook_url: string
  items: LiraPayItem[]
  ip: string
  customer: LiraPayCustomer
  splits?: Array<{
    recipient_id: string
    percentage: number
  }>
}

interface CreateTransactionResponse {
  id: string
  external_id: string
  status: "AUTHORIZED" | "PENDING" | "CHARGEBACK" | "FAILED" | "IN_DISPUTE"
  total_value: number
  customer: {
    email: string
    name: string
  }
  payment_method: string
  pix: {
    payload: string
  }
  hasError: boolean
}

interface TransactionStatus {
  id: string
  external_id: string | null
  status: "PENDING" | "AUTHORIZED" | "FAILED" | "CHARGEBACK" | "IN_DISPUTE"
  amount: number
  payment_method: string
  customer: {
    name: string
    email: string
    phone: string
    document: string
    address: {
      cep: string
      city: string
      state: string
      number: string
      street: string
      complement: string
      neighborhood: string
    }
  }
  created_at: string
}

export class LiraPayAPI {
  private apiSecret: string
  private baseURL: string

  constructor(apiSecret: string) {
    this.apiSecret = apiSecret
    this.baseURL = LIRAPAY_BASE_URL
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    console.log(`[v0] Fazendo requisição para: ${url}`)
    console.log(`[v0] Headers:`, {
      "api-secret": this.apiSecret ? "***configurado***" : "não configurado",
      "Content-Type": "application/json",
    })
    console.log(`[v0] Body:`, options.body)

    const response = await fetch(url, {
      ...options,
      headers: {
        "api-secret": this.apiSecret,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    console.log(`[v0] Status da resposta: ${response.status}`)

    if (!response.ok) {
      let errorDetails = `${response.status} ${response.statusText}`
      try {
        const errorBody = await response.text()
        console.log(`[v0] Corpo da resposta de erro:`, errorBody)
        errorDetails += ` - ${errorBody}`
      } catch (e) {
        console.log(`[v0] Não foi possível ler o corpo da resposta de erro`)
      }
      throw new Error(`LiraPay API Error: ${errorDetails}`)
    }

    const responseData = await response.json()
    console.log(`[v0] Resposta da API:`, responseData)
    return responseData
  }

  async createTransaction(data: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    return this.makeRequest<CreateTransactionResponse>("/v1/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getTransaction(transactionId: string): Promise<TransactionStatus> {
    return this.makeRequest<TransactionStatus>(`/v1/transactions/${transactionId}`)
  }

  async getAccountInfo(): Promise<{ email: string; name: string; document: string }> {
    return this.makeRequest<{ email: string; name: string; document: string }>("/v1/account-info")
  }
}

// Função helper para gerar external_id único
export function generateExternalId(): string {
  return `rifa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Função helper para obter IP do cliente
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return "127.0.0.1" // fallback para desenvolvimento
}

// Função para formatar dados do cliente para LiraPay
export function formatCustomerData(customerData: {
  name: string
  email: string
  phone: string
  document: string
}): LiraPayCustomer {
  return {
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone.replace(/\D/g, ""), // Remove formatação
    document_type: "CPF",
    document: customerData.document.replace(/\D/g, ""), // Remove formatação
    utm_source: "site_rifa",
    utm_medium: "web",
    utm_campaign: "rifa_2025",
  }
}
