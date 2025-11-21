import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRobot, FaTimes, FaPaperPlane, FaUser, FaSearch } from 'react-icons/fa'
import { sendChatMessage, ChatMessage, generateMessageId } from '@/services/aiChatService'
import toast from 'react-hot-toast'

export default function AIChatBot() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateMessageId(),
      message: '¡Hola! Soy AeroBot, tu asistente de vuelos ✈️\n\n¿En qué puedo ayudarte hoy?\n\nPuedes preguntarme cosas como:\n• "Quiero volar de Bogotá a Medellín mañana"\n• "Muéstrame mis reservas"\n• "¿Qué aeropuertos están disponibles?"',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      message: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await sendChatMessage(inputMessage)
      
      const botMessage: ChatMessage = {
        id: generateMessageId(),
        message: response.response,
        isUser: false,
        timestamp: new Date(),
        action: response.action,
        data: response.data
      }

      setMessages(prev => [...prev, botMessage])

      // Si hay una acción específica, ejecutarla
      if (response.action === 'search' && response.data) {
        const flights = Array.isArray(response.data) ? response.data : []
        if (flights.length > 0) {
          toast.success(`¡Encontré ${flights.length} vuelo(s) disponible(s)!`)
          // Agregar botón para ver resultados
          setTimeout(() => {
            const searchButton: ChatMessage = {
              id: generateMessageId(),
              message: 'Ver resultados de búsqueda',
              isUser: false,
              timestamp: new Date(),
              action: 'search_button',
              data: response.data
            }
            setMessages(prev => [...prev, searchButton])
          }, 1000)
        }
      } else if (response.action === 'reservations') {
        // Navegar a mis reservas
        setTimeout(() => {
          navigate('/mis-reservas')
          setIsOpen(false)
        }, 1500)
      }

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        message: 'Lo siento, tuve un problema procesando tu solicitud. ¿Podrías intentar de nuevo?',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      toast.error('Error al procesar el mensaje')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessage = (message: string) => {
    return message.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < message.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-hero text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: isOpen ? '0 0 0 0 rgba(59, 130, 246, 0)' : '0 0 0 10px rgba(59, 130, 246, 0.3)'
        }}
        transition={{
          boxShadow: {
            duration: 1.5,
            repeat: isOpen ? 0 : Infinity,
            repeatType: 'reverse'
          }
        }}
      >
        <FaRobot className="text-2xl" />
      </motion.button>

      {/* Modal de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-hero text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <FaRobot className="text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold">AeroBot</h3>
                  <p className="text-xs opacity-90">Asistente de vuelos</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isUser && (
                    <div className="bg-gradient-hero text-white p-2 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <FaRobot className="text-xs" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : message.action === 'search_button'
                        ? 'bg-gradient-hero text-white rounded-bl-md cursor-pointer hover:opacity-90'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}
                    onClick={() => {
                      if (message.action === 'search_button' && message.data) {
                        // Navegar a búsqueda con resultados
                        navigate('/vuelos')
                        setIsOpen(false)
                        toast.success('Mostrando resultados de búsqueda')
                      }
                    }}
                  >
                    {message.action === 'search_button' ? (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <FaSearch />
                        {message.message}
                      </div>
                    ) : (
                      <div className="text-sm whitespace-pre-wrap">
                        {formatMessage(message.message)}
                      </div>
                    )}
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>

                  {message.isUser && (
                    <div className="bg-blue-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <FaUser className="text-xs" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="bg-gradient-hero text-white p-2 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <FaRobot className="text-xs" />
                  </div>
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-hero text-white p-2 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
