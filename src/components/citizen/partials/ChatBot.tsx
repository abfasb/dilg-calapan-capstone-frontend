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
    import { CheckCircle2, Loader2, MessageSquare, Send } from 'lucide-react';
    import { cn } from '../../../lib/utils'

    const initialMessages = [
    {
        id: '1',
        content: 'Hello! How can I assist you today?',
        sender: 'admin',
        timestamp: new Date(Date.now() - 3600000),
        status: 'read'
    },
    {
        id: '2',
        content: 'I need help with my recent appointment.',
        sender: 'user',
        timestamp: new Date(Date.now() - 1800000),
        status: 'delivered'
    }
    ]

    export default function ChatBot() {
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [messages, setMessages] = useState(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isAdminTyping, setIsAdminTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return

        const userMessage = {
        id: Date.now().toString(),
        content: newMessage,
        sender: 'user',
        timestamp: new Date(),
        status: 'sent'
        }

        setMessages(prev => [...prev, userMessage])
        setNewMessage('')
        setIsSending(true)

        setTimeout(() => {
        const adminResponse = {
            id: (Date.now() + 1).toString(),
            content: 'Thank you for your message. Our support team will respond shortly.',
            sender: 'admin',
            timestamp: new Date(),
            status: 'read'
        }

        setMessages(prev => [...prev, adminResponse])
        setIsSending(false)
        }, 2000)
    }

    return (
        <Card className="relative group hover:shadow-lg transition-shadow h-fit">
        <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <MessageSquare className="w-6 h-6 text-primary" />
            Support Channel
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => setIsChatOpen(true)}>
            Start Conversation
            </Button>

            {isChatOpen && (
            <div className="fixed inset-0 w-full h-full bg-black/50 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
                <CardHeader className="bg-muted py-4 border-b">
                    <CardTitle className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src="/admin-avatar.jpg" />
                        <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">Support Agent</p>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {isAdminTyping ? (
                            <span className="flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Typing...
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            Online
                            </span>
                        )}
                        </div>
                    </div>
                    </CardTitle>
                </CardHeader>

                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-6">
                    {messages.map(message => (
                        <div
                        key={message.id}
                        className={cn(
                            'flex gap-3',
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                        )}
                        >
                        {message.sender === 'admin' && (
                            <Avatar className="w-8 h-8">
                            <AvatarImage src="/admin-avatar.jpg" />
                            <AvatarFallback>SA</AvatarFallback>
                            </Avatar>
                        )}
                        <div
                            className={cn(
                            'max-w-[75%] rounded-xl p-4 space-y-1',
                            message.sender === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            )}
                        >
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center gap-2 text-xs">
                            <span className="opacity-70">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                                })}
                            </span>
                            {message.sender === 'user' && (
                                <span className="ml-2">
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
                    <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                <CardFooter className="border-t p-4">
                    <div className="flex w-full items-center gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        disabled={isSending}
                    />
                    <Button
                        size="icon"
                        onClick={handleSendMessage}
                        disabled={isSending || !newMessage.trim()}
                    >
                        {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                        <Send className="w-4 h-4" />
                        )}
                    </Button>
                    </div>
                </CardFooter>
                </Card>
            </div>
            )}
        </CardContent>
        </Card>
    )
    }
