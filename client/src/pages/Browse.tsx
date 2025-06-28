import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import SwipeInterface from "@/components/SwipeInterface";
import FilterSidebar from "@/components/FilterSidebar";
import MatchesSidebar from "@/components/MatchesSidebar";
import ProfileModal from "@/components/ProfileModal";
import ChatModal from "@/components/ChatModal";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Browse() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

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

  const handleChatOpen = (matchId: string) => {
    setSelectedMatchId(matchId);
    setShowChatModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--swipe-primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--swipe-neutral)]">
      <Navigation onProfileClick={() => setShowProfileModal(true)} />
      
      <div className="flex h-screen pt-16">
        {/* Filter Sidebar */}
        <FilterSidebar />
        
        {/* Main Swipe Area */}
        <div className="flex-1">
          <SwipeInterface />
        </div>
        
        {/* Matches Sidebar */}
        <MatchesSidebar onChatOpen={handleChatOpen} />
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
        <div className="flex justify-around py-2">
          <button className="flex flex-col items-center py-2 px-4 text-[var(--swipe-primary)]">
            <i className="fas fa-home text-xl"></i>
            <span className="text-xs mt-1">Browse</span>
          </button>
          <button className="flex flex-col items-center py-2 px-4 text-gray-400">
            <i className="fas fa-heart text-xl"></i>
            <span className="text-xs mt-1">Matches</span>
          </button>
          <button className="flex flex-col items-center py-2 px-4 text-gray-400">
            <i className="fas fa-comment text-xl"></i>
            <span className="text-xs mt-1">Chat</span>
          </button>
          <button 
            className="flex flex-col items-center py-2 px-4 text-gray-400"
            onClick={() => setShowProfileModal(true)}
          >
            <i className="fas fa-user text-xl"></i>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      
      {selectedMatchId && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => {
            setShowChatModal(false);
            setSelectedMatchId(null);
          }}
          matchId={selectedMatchId}
        />
      )}
    </div>
  );
}
