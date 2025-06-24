import { useEffect, useRef, useState } from 'react'
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle
} from '../../ui/card'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../ui/avatar'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { ScrollArea } from '../../ui/scroll-area'
import { CheckCircle2, Loader2, MessageSquare, Send, User, Bot, X } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Badge } from '../../ui/badge'
import ReactMarkdown from 'react-markdown'
import io from 'socket.io-client'
import remarkGfm from 'remark-gfm'
import { useLocalStorage } from 'usehooks-ts'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../ui/dialog'

type Message = {
  id: string
  content: string
  sender: 'user' | 'ai' | 'human' | 'system'
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! I\'m your AI assistant. How can I help you today?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 3600000),
    status: 'read'
  }
]

export default function ChatBot() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useLocalStorage<Message[]>('chat-history', initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<'ai' | 'human'>('ai')
  const [isHumanRequested, setIsHumanRequested] = useState(false)
  const [error, setError] = useState('')
  const [humanChatHistory, setHumanChatHistory] = useLocalStorage<Message[]>('human-chat-history', [])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const socketRef = useRef<any>(null)
  const userId = useRef<string>(Math.random().toString(36).substr(2, 9))

  const API_URL = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta'
  const API_KEY = import.meta.env.VITE_API_HUGGING_FACE

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setError('');
      newSocket.emit('register_user', userId.current);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setError('Connection lost. Reconnecting...');
    });

    newSocket.on('connect_error', (err: any) => {
      console.error('Connection Error:', err);
      setError('Failed to connect to chat server');
    });

    newSocket.on('receive_message', (msg: any) => {
      console.log('Received message from admin:', msg);
      const newMessage: Message = {
        id: Date.now().toString(),
        content: msg.message,
        sender: 'human',
        timestamp: new Date(msg.timestamp),
        status: 'read'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setHumanChatHistory(prev => [...prev, newMessage]);
    });

    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleConnectToHuman = () => {
    if (!socketRef.current?.connected) {
      setError('Connection error. Please try again later.');
      return;
    }

    console.log('Requesting human agent for user:', userId.current);
    socketRef.current.emit('request_human', userId.current);
    
    const systemMessage: Message = {
      id: Date.now().toString(),
      content: 'Connecting you to a human support agent...',
      sender: 'system',
      timestamp: new Date(),
      status: 'read'
    };
    
    setMessages(prev => [...prev, systemMessage]);
    setCurrentAgent('human');
    setIsHumanRequested(true);

    socketRef.current.emit('register_user', userId.current);
  };

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isChatOpen])

  const generateAIResponse = async (prompt: string) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          inputs: `<|system|>
          You are a helpful AI assistant for government services. 
          Provide detailed, accurate answers in a friendly tone.
          Keep responses under 500 characters.
          </s>
          <|user|>
          ${prompt}</s>
          <|assistant|>`,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            repetition_penalty: 1.2
          }
        })
      })

      if (!response.ok) throw new Error('API request failed')

      const data = await response.json()
      return data[0].generated_text.split('<|assistant|>')[1].trim()
    } catch (err) {
      console.error('AI Error:', err)
      setError('Sorry, I\'m having trouble responding. Please try again.')
      return null
    }
  }

  const handleAIResponse = async (userMessage: string) => {
    setIsTyping(true)
    setError('')

    try {
      const aiResponse = await generateAIResponse(userMessage)
      
      if (!aiResponse) return

      const newAiMessage: Message = {
        id: Date.now().toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        status: 'read'
      }

      setMessages(prev => [...prev, newAiMessage])
    } catch (err) {
      setError('Failed to get AI response. Please try again.')
    } finally {
      setIsTyping(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, userMessage])
    
    // If current agent is human, also add the message to human chat history
    if (currentAgent === 'human') {
      setHumanChatHistory(prev => [...prev, userMessage])
    }
    
    const currentMessageText = newMessage
    setNewMessage('')
    setIsSending(true)

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'delivered' } 
            : msg
        )
      )
      
      if (currentAgent === 'human') {
        setHumanChatHistory(prev => 
          prev.map(msg => 
            msg.id === userMessage.id 
              ? { ...msg, status: 'delivered' } 
              : msg
          )
        )
      }
    }, 500)

    try {
      if (currentAgent === 'human') {
        console.log('Sending message to human agent:', currentMessageText)
        
        socketRef.current?.emit('send_message', {
          userId: userId.current,
          message: currentMessageText,
          sender: 'user',
          timestamp: new Date()
        })
      } else {
        await handleAIResponse(currentMessageText)
      }
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleReturnToAI = () => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      content: 'Returning to AI assistant...',
      sender: 'system',
      timestamp: new Date(),
      status: 'read'
    }
    
    setMessages(prev => [...prev, systemMessage])
    setCurrentAgent('ai')
    setIsHumanRequested(false)
    
  }

  const clearChatHistory = () => {
    setMessages(initialMessages)
    setHumanChatHistory([])
  }

  return (
    <Card className="relative group hover:shadow-lg transition-shadow h-full dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          Government AI Assistant
          <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
            Live
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Get instant help with government services
        </p>
      </CardHeader>
      <CardContent className="space-y-4 mt-4">
       <Button 
        className="w-full flex items-center justify-center gap-4 bg-black hover:from-blue-600 hover:to-purple-700 text-white" 
        onClick={() => setIsChatOpen(true)}
      >
        <MessageSquare className="w-4 h-4" />
        Start Chat
        <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
      </Button>


      </CardContent>

      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg p-0 gap-0 h-[85vh] max-h-[85vh] flex flex-col">
          <DialogHeader className="bg-primary text-primary-foreground py-3 px-4 border-b flex flex-row justify-between items-center">
            <DialogTitle className="flex items-center gap-3 m-0">
              <Avatar className="w-8 h-8 bg-primary-foreground text-primary">
                <AvatarImage src={currentAgent === 'ai' ? "/ai-avatar.jpg" : "/human-avatar.jpg"} />
                <AvatarFallback>
                  {currentAgent === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{currentAgent === 'ai' ? 'AI Assistant' : 'Human Support'}</p>
                <div className="text-xs text-primary-foreground/80 flex items-center gap-2">
                  {isTyping ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Typing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Online
                    </span>
                  )}
                </div>
              </div>
            </DialogTitle>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-primary-foreground/20"
                onClick={clearChatHistory}
              >
                <span className="text-xs">⟳</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-primary-foreground/20"
                onClick={() => setIsChatOpen(false)}
              >
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 px-4 py-6">
            <div className="space-y-6">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.sender === 'user' ? 'justify-end' : 'justify-start',
                    message.sender === 'system' && 'justify-center'
                  )}
                >
                  {message.sender !== 'user' && message.sender !== 'system' && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage 
                        src={message.sender === 'ai' ? "/ai-avatar.jpg" : "/human-avatar.jpg"} 
                      />
                      <AvatarFallback className={message.sender === 'ai' ? 'bg-blue-500' : 'bg-green-500'}>
                        {message.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-xl p-3 space-y-1',
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : message.sender === 'system'
                        ? 'bg-muted/50 text-muted-foreground py-2 px-3 text-xs'
                        : message.sender === 'ai'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-foreground'
                        : 'bg-green-100 dark:bg-green-900/30 text-foreground'
                    )}
                  >
                    {message.sender !== 'system' && message.sender !== 'user' && (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs mb-1",
                          message.sender === 'ai' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'
                        )}
                      >
                        {message.sender === 'ai' ? 'AI Assistant' : 'Human Agent'}
                      </Badge>
                    )}
                    <div className="prose prose-sm dark:prose-invert">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {message.sender === 'user' && (
                        <span className="ml-1">
                          {message.status === 'sent' && <Loader2 className="w-3 h-3 animate-spin" />}
                          {message.status === 'delivered' && <CheckCircle2 className="w-3 h-3" />}
                          {message.status === 'read' && (
                            <CheckCircle2 className="w-3 h-3 text-primary-foreground/50" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {error && (
                <div className="text-center text-sm text-red-500">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="px-4 py-2 flex items-center justify-between border-t">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className={currentAgent === 'ai' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}>
                  {currentAgent === 'ai' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {currentAgent === 'ai' ? 'AI Assistant' : 'Human Support'}
              </span>
            </div>
            <div className="flex gap-2">
              {currentAgent === 'ai' ? (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs h-8" 
                  onClick={handleConnectToHuman}
                >
                  <User className="w-3 h-3 mr-1" />
                  Human Help
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs h-8" 
                  onClick={handleReturnToAI}
                >
                  <Bot className="w-3 h-3 mr-1" />
                  Return to AI
                </Button>
              )}
            </div>
          </div>

          <DialogFooter className="px-4 py-3 border-t">
            <div className="flex w-full items-center gap-2">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                disabled={isSending}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.trim()}
                className="h-10 w-10"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}