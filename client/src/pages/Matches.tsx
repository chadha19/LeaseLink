import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Match, Property } from "@shared/schema";
import Navigation from "@/components/Navigation";
import ChatModal from "@/components/ChatModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, MapPin, Home } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Matches() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(false);
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

  const { data: matches = [], isLoading: matchesLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
    enabled: isAuthenticated,
  });

  const handleChatOpen = (matchId: string) => {
    setSelectedMatchId(matchId);
    setShowChat(true);
  };

  if (isLoading || matchesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--swipe-primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading matches...</p>
        </div>
      </div>
    );
  }

  const approvedMatches = matches.filter(match => match.status === 'approved');
  const pendingMatches = matches.filter(match => match.status === 'pending');

  return (
    <div className="min-h-screen bg-[var(--swipe-neutral)]">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--swipe-secondary)]">Your Matches</h1>
          <p className="text-gray-600 mt-2">Properties you've matched with and can chat about</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--swipe-secondary)]">{matches.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingMatches.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Chats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--swipe-accent)]">{approvedMatches.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Matches */}
        {approvedMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--swipe-secondary)] mb-4">
              Active Conversations ({approvedMatches.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvedMatches.map((match) => (
                <Card key={match.id} className="hover:shadow-lg transition-shadow cursor-pointer border-[var(--swipe-accent)] border-opacity-30">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Property Match</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="mr-1" size={14} />
                          Match ID: {match.id.slice(0, 8)}...
                        </CardDescription>
                      </div>
                      <Badge className="bg-[var(--swipe-accent)] text-white">
                        Approved
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Matched on {new Date(match.createdAt!).toLocaleDateString()}
                      </div>
                      <Button
                        onClick={() => handleChatOpen(match.id)}
                        className="bg-[var(--swipe-primary)] hover:bg-opacity-90"
                      >
                        <MessageCircle className="mr-2" size={16} />
                        Chat Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Pending Matches */}
        {pendingMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--swipe-secondary)] mb-4">
              Waiting for Approval ({pendingMatches.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingMatches.map((match) => (
                <Card key={match.id} className="border-yellow-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Property Interest</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Home className="mr-1" size={14} />
                          Match ID: {match.id.slice(0, 8)}...
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600">
                      Submitted on {new Date(match.createdAt!).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Waiting for landlord approval to start chatting
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {matches.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <MessageCircle size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No matches yet</h3>
              <p className="text-gray-500 mb-4">
                Start swiping on properties to find your perfect match!
              </p>
              <Button 
                onClick={() => window.location.href = '/browse'}
                className="bg-[var(--swipe-primary)] hover:bg-opacity-90"
              >
                Browse Properties
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chat Modal */}
      {selectedMatchId && (
        <ChatModal
          isOpen={showChat}
          onClose={() => {
            setShowChat(false);
            setSelectedMatchId(null);
          }}
          matchId={selectedMatchId}
        />
      )}
    </div>
  );
}
