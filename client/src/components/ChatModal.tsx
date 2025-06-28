import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Message, Match } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  isFullScreen?: boolean;
}

export default function ChatModal({ isOpen, onClose, matchId, isFullScreen = false }: ChatModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useWebSocket();

  const { data: match } = useQuery<Match>({
    queryKey: [`/api/matches/${matchId}`],
    enabled: isOpen && !!matchId,
  });

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: [`/api/matches/${matchId}/messages`],
    enabled: isOpen && !!matchId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Send via WebSocket for real-time delivery
      sendMessage({
        type: 'chat_message',
        matchId,
        content,
        senderId: user.id,
      });
      
      return content;
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: [`/api/matches/${matchId}/messages`] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    sendMessageMutation.mutate(newMessage.trim());
  };

  const formatTime = (timestamp: string | Date | null) => {
    if (!timestamp) return '';
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMyMessage = (message: Message) => {
    return message.senderId === user?.id;
  };

  if (isFullScreen) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--swipe-primary)] rounded-lg flex items-center justify-center text-white font-semibold">
              {match?.propertyId?.slice(0, 2)?.toUpperCase() || 'PM'}
            </div>
            <div>
              <h4 className="font-medium text-[var(--swipe-secondary)]">Property Match</h4>
              <p className="text-sm text-gray-500">Match ID: {matchId.slice(0, 8)}...</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--swipe-primary)] mx-auto mb-2"></div>
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}>
                <div className={`${isMyMessage(message) ? 'chat-message-sent' : 'chat-message-received'}`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${isMyMessage(message) ? 'text-pink-200' : 'text-gray-400'}`}>
                    {formatTime(message.createdAt!)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
            />
            <Button 
              type="submit"
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
              className="bg-[var(--swipe-primary)] hover:bg-opacity-90"
            >
              <Send size={16} />
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        {/* Chat Header */}
        <DialogHeader className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--swipe-primary)] rounded-lg flex items-center justify-center text-white font-semibold">
              {match?.propertyId?.slice(0, 2)?.toUpperCase() || 'PM'}
            </div>
            <div>
              <DialogTitle className="font-medium text-[var(--swipe-secondary)]">Property Match</DialogTitle>
              <p className="text-sm text-gray-500">Match ID: {matchId.slice(0, 8)}...</p>
            </div>
          </div>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-96">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--swipe-primary)] mx-auto mb-2"></div>
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}>
                <div className={`${isMyMessage(message) ? 'chat-message-sent' : 'chat-message-received'}`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${isMyMessage(message) ? 'text-pink-200' : 'text-gray-400'}`}>
                    {formatTime(message.createdAt!)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
            />
            <Button 
              type="submit"
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
              className="bg-[var(--swipe-primary)] hover:bg-opacity-90"
            >
              <Send size={16} />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
