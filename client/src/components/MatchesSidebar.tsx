import { useQuery } from "@tanstack/react-query";
import { Match } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Eye } from "lucide-react";

interface MatchesSidebarProps {
  onChatOpen: (matchId: string) => void;
}

export default function MatchesSidebar({ onChatOpen }: MatchesSidebarProps) {
  const { data: matches = [] } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
  });

  const approvedMatches = matches.filter(match => match.status === 'approved').slice(0, 5);
  const pendingMatches = matches.filter(match => match.status === 'pending').slice(0, 3);

  return (
    <div className="hidden xl:block w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <Card className="border-0 rounded-none">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-[var(--swipe-secondary)]">
              Recent Matches
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-[var(--swipe-primary)] hover:underline">
              <Eye size={16} className="mr-1" />
              View All
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Approved Matches */}
          {approvedMatches.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">Active Conversations</h4>
              <div className="space-y-3">
                {approvedMatches.map((match) => (
                  <div
                    key={match.id}
                    className="match-item"
                    onClick={() => onChatOpen(match.id)}
                  >
                    <div className="w-12 h-12 bg-[var(--swipe-primary)] rounded-lg flex items-center justify-center text-white font-semibold">
                      {match.propertyId.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[var(--swipe-secondary)]">Property Match</h4>
                      <p className="text-sm text-gray-500">Ready to chat</p>
                      <div className="flex items-center mt-1">
                        <Badge className="bg-[var(--swipe-accent)] text-white text-xs">
                          Approved
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Matches */}
          {pendingMatches.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">Waiting for Approval</h4>
              <div className="space-y-3">
                {pendingMatches.map((match) => (
                  <div key={match.id} className="match-item opacity-75">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 font-semibold">
                      {match.propertyId.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[var(--swipe-secondary)]">Property Interest</h4>
                      <p className="text-sm text-gray-500">Pending landlord approval</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                          Pending
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {matches.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-3">No matches yet</p>
              <p className="text-xs text-gray-400">
                Keep swiping to find your perfect property match!
              </p>
            </div>
          )}

          {/* Action Button */}
          {approvedMatches.length > 0 && (
            <Button 
              className="w-full bg-[var(--swipe-primary)] hover:bg-opacity-90"
              onClick={() => window.location.href = '/matches'}
            >
              View All Matches
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
