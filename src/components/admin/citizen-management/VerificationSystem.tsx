import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';
import { Loader2, Send, User, X } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ChatMessage {
  userId: string;
  message: string;
  sender: 'user' | 'admin';
  timestamp: Date;
}

const ChatSupport = () => {
  const [activeRequests, setActiveRequests] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket']
    });
    
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Admin connected to server:', newSocket.id);
      newSocket.emit('admin_connect');
    });

    newSocket.on('pending_requests', (requests: string[]) => {
      console.log('Received pending requests:', requests);
      setActiveRequests(requests);
    });

    newSocket.on('new_request', (userId: string) => {
      console.log('New request from user:', userId);
      setActiveRequests(prev => {
        if (!prev.includes(userId)) {
          return [...prev, userId];
        }
        return prev;
      });
    });

    newSocket.on('chat_history', (history: ChatMessage[]) => {
      console.log('Received chat history:', history);
      setChatHistory(history);
    });

    newSocket.on('user_message', (msg: ChatMessage) => {
      console.log('Received user message:', msg);
      if (selectedUser === msg.userId) {
        setChatHistory(prev => [...prev, msg]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // This effect updates the selectedUser when it changes
  useEffect(() => {
    if (selectedUser) {
      socketRef.current?.emit('admin_join', selectedUser);
    }
  }, [selectedUser]);

  const handleJoinChat = (userId: string) => {
    setSelectedUser(userId);
    setIsConnecting(true);
    
    // Clear any previous chat history
    setChatHistory([]);
    
    setTimeout(() => {
      setIsConnecting(false);
    }, 1000);
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;
    
    setIsSending(true);

    const newMessage: ChatMessage = {
      userId: selectedUser,
      message,
      sender: 'admin',
      timestamp: new Date()
    };

    socketRef.current?.emit('send_message', newMessage);
    setChatHistory(prev => [...prev, newMessage]);
    setMessage('');
    
    setTimeout(() => {
      setIsSending(false);
    }, 500);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-4">Active Requests</h2>
        {activeRequests.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No active requests</div>
        ) : (
          <ScrollArea className="h-[calc(100vh-150px)]">
            {activeRequests.map(userId => (
              <div
                key={userId}
                className={cn(
                  'p-3 mb-2 cursor-pointer hover:bg-gray-50 rounded',
                  selectedUser === userId && 'bg-blue-50'
                )}
                onClick={() => handleJoinChat(userId)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User size={16} /></AvatarFallback>
                  </Avatar>
                  <span className="font-medium">User {userId.slice(-4)}</span>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedUser && (
              <>
                <Avatar className="h-10 w-10">
                  <AvatarFallback><User size={20} /></AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">User {selectedUser?.slice(-4)}</h3>
              </>
            )}
          </div>
          {selectedUser && (
            <Button variant="ghost" onClick={() => setSelectedUser(null)}>
              <X className="mr-2 h-4 w-4" /> Close Chat
            </Button>
          )}
        </div>

        {isConnecting ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
            <span>Connecting to chat...</span>
          </div>
        ) : selectedUser ? (
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 my-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex mb-4',
                      msg.sender === 'admin' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[70%] rounded-lg p-3',
                        msg.sender === 'admin'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100'
                      )}
                    >
                      <p>{msg.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isSending}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!message.trim() || isSending}
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user from the sidebar to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSupport;