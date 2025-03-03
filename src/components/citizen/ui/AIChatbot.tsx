// components/ai-chatbot.tsx
import { useState } from 'react'
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { MessageSquare, Bot } from 'lucide-react'

export const AIChatbot = () => {
  const [messages, setMessages] = useState<Array<{content: string, isUser: boolean}>>([
    { content: "Hello! I'm your DILG Assistant. How can I help you today?", isUser: false }
  ])
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    setMessages(prev => [...prev, { content: input, isUser: true }])
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        content: "Thank you for your inquiry. We'll get back to you within 24 hours.", 
        isUser: false 
      }])
    }, 1000)
    
    setInput('')
  }

  return (
    <div className="h-96 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} gap-2`}>
            <div className={`p-3 rounded-lg max-w-[80%] ${msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..." 
        />
        <Button type="submit">
          <Bot className="w-4 h-4 mr-2" /> Send
        </Button>
      </form>
    </div>
  )
}