import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import ChatModal from "@/components/ChatModal";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Chat() {
  const { matchId } = useParams<{ matchId: string }>();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--swipe-primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!matchId) {
    return (
      <div className="min-h-screen bg-[var(--swipe-neutral)]">
        <Navigation />
        <div className="flex items-center justify-center h-screen pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Chat Not Found</h1>
            <p className="text-gray-600">The chat you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--swipe-neutral)]">
      <Navigation />
      <div className="pt-16 h-screen">
        <ChatModal
          isOpen={true}
          onClose={() => window.history.back()}
          matchId={matchId}
          isFullScreen={true}
        />
      </div>
    </div>
  );
}
