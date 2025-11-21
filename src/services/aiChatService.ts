import { api } from '@/api/client'

export interface ChatMessage {
  id: string
  message: string
  isUser: boolean
  timestamp: Date
  action?: string
  data?: any
}

export interface ChatResponse {
  response: string
  action?: string
  data?: any
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>('/api/ai/chat', {
    message: message.trim()
  }, {
    withCredentials: true
  })
  
  return data
}

export function generateMessageId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}
