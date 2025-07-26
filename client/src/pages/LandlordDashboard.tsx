import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Property, Match } from "@shared/schema";
import Navigation from "@/components/Navigation";
import AddPropertyModal from "@/components/AddPropertyModal";
import ProfileModal from "@/components/ProfileModal";
import ChatModal from "@/components/ChatModal";
import BuyerProfileModal from "@/components/BuyerProfileModal";
import PropertyMap from "@/components/PropertyMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, MessageSquare, CheckCircle, XCircle, Trash2, Archive, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function LandlordDashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showBuyerProfile, setShowBuyerProfile] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

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

  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/my"],
    enabled: isAuthenticated,
  });

  const { data: matches = [] } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
    enabled: isAuthenticated,
  });

  const approveMatchMutation = useMutation({
    mutationFn: async ({ matchId, status }: { matchId: string; status: string }) => {
      await apiRequest("PATCH", `/api/matches/${matchId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      toast({
        title: "Success",
        description: "Match status updated successfully",
      });
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
        description: "Failed to update match status",
        variant: "destructive",
      });
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      await apiRequest("DELETE", `/api/properties/${propertyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties/my"] });
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
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
        description: "Failed to delete property",
        variant: "destructive",
      });
    },
  });

  const togglePropertyStatusMutation = useMutation({
    mutationFn: async ({ propertyId, isActive }: { propertyId: string; isActive: boolean }) => {
      await apiRequest("PATCH", `/api/properties/${propertyId}`, { isActive });
    },
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties/my"] });
      toast({
        title: "Success",
        description: isActive ? "Property reactivated" : "Property marked as sold/inactive",
      });
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
        description: "Failed to update property status",
        variant: "destructive",
      });
    },
  });

  const handleChatOpen = (matchId: string) => {
    setSelectedMatchId(matchId);
    setShowChat(true);
  };

  const handleViewBuyerProfile = (match: Match) => {
    setSelectedBuyerId(match.buyerId);
    setSelectedMatch(match);
    setShowBuyerProfile(true);
  };

  const handleApproveBuyer = () => {
    if (selectedMatch) {
      approveMatchMutation.mutate({ 
        matchId: selectedMatch.id, 
        status: 'approved' 
      });
      setShowBuyerProfile(false);
    }
  };

  const handleRejectBuyer = () => {
    if (selectedMatch) {
      approveMatchMutation.mutate({ 
        matchId: selectedMatch.id, 
        status: 'rejected' 
      });
      setShowBuyerProfile(false);
    }
  };

  if (isLoading || propertiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--swipe-primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingMatches = matches.filter(match => match.status === 'pending');
  const approvedMatches = matches.filter(match => match.status === 'approved');

  return (
    <div className="min-h-screen bg-[var(--swipe-neutral)]">
      <Navigation onProfileClick={() => setShowProfile(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--swipe-secondary)]">My Properties</h1>
            <p className="text-gray-600 mt-2">Manage your listings and tenant applications</p>
          </div>
          <Button 
            onClick={() => setShowAddProperty(true)}
            className="bg-[var(--swipe-primary)] hover:bg-opacity-90"
          >
            <Plus className="mr-2" size={16} />
            Add New Property
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--swipe-secondary)]">{properties.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Matches</CardTitle>
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
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {matches.filter(m => {
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return new Date(m.createdAt!) > monthAgo;
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Matches */}
        {pendingMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--swipe-secondary)] mb-4">
              Pending Applications ({pendingMatches.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingMatches.map((match) => {
                const property = properties.find(p => p.id === match.propertyId);
                return (
                  <Card key={match.id} className="border-yellow-200">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{property?.title}</CardTitle>
                          <CardDescription>New application received</CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewBuyerProfile(match)}
                          className="w-full mb-2"
                        >
                          <User className="mr-1" size={14} />
                          View Buyer Profile
                        </Button>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => approveMatchMutation.mutate({ matchId: match.id, status: 'approved' })}
                            className="flex-1 bg-[var(--swipe-accent)] hover:bg-opacity-90"
                            disabled={approveMatchMutation.isPending}
                          >
                            <CheckCircle className="mr-1" size={14} />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => approveMatchMutation.mutate({ matchId: match.id, status: 'rejected' })}
                            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                            disabled={approveMatchMutation.isPending}
                          >
                            <XCircle className="mr-1" size={14} />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Properties Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--swipe-secondary)] mb-4">
            Your Properties ({properties.length})
          </h2>
          
          {properties.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <Plus size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No properties yet</h3>
                <p className="text-gray-500 mb-4">Start by adding your first property listing</p>
                <Button 
                  onClick={() => setShowAddProperty(true)}
                  className="bg-[var(--swipe-primary)] hover:bg-opacity-90"
                >
                  Add Your First Property
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => {
                const propertyMatches = matches.filter(m => m.propertyId === property.id);
                const interestedCount = propertyMatches.filter(m => m.status === 'pending' || m.status === 'approved').length;
                const activeChats = propertyMatches.filter(m => m.status === 'approved').length;
                
                return (
                  <Card key={property.id} className="overflow-hidden">
                    {property.images && property.images.length > 0 && (
                      <div className="h-48 bg-gray-200">
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{property.title}</CardTitle>
                      <CardDescription>{property.address}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-[var(--swipe-primary)]">
                          ${property.price.toLocaleString()}/month
                        </span>
                        <Badge variant={property.isActive ? "default" : "secondary"}>
                          {property.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Eye className="mr-1" size={14} />
                          {interestedCount} interested
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="mr-1" size={14} />
                          {activeChats} chats
                        </span>
                      </div>

                      <div className="space-y-3">
                        {/* Property Map */}
                        <PropertyMap 
                          address={property.address}
                          latitude={property.latitude}
                          longitude={property.longitude}
                          title={property.title}
                        />
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setEditingProperty(property)}
                          >
                            Edit
                          </Button>
                          {activeChats > 0 && (
                            <Button 
                              size="sm"
                              className="flex-1 bg-[var(--swipe-accent)] hover:bg-opacity-90"
                              onClick={() => {
                                const approvedMatch = propertyMatches.find(m => m.status === 'approved');
                                if (approvedMatch) {
                                  handleChatOpen(approvedMatch.id);
                                }
                              }}
                            >
                              Chat Now
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => togglePropertyStatusMutation.mutate({ 
                              propertyId: property.id, 
                              isActive: !property.isActive 
                            })}
                            disabled={togglePropertyStatusMutation.isPending}
                          >
                            <Archive className="mr-1" size={14} />
                            {property.isActive ? "Mark Sold" : "Reactivate"}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
                                deletePropertyMutation.mutate(property.id);
                              }
                            }}
                            disabled={deletePropertyMutation.isPending}
                          >
                            <Trash2 className="mr-1" size={14} />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddPropertyModal 
        isOpen={showAddProperty || !!editingProperty}
        onClose={() => {
          setShowAddProperty(false);
          setEditingProperty(null);
        }}
        editingProperty={editingProperty}
      />
      
      <ProfileModal 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
      
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

      {selectedBuyerId && (
        <BuyerProfileModal
          isOpen={showBuyerProfile}
          onClose={() => {
            setShowBuyerProfile(false);
            setSelectedBuyerId(null);
            setSelectedMatch(null);
          }}
          buyerId={selectedBuyerId}
          onApprove={handleApproveBuyer}
          onReject={handleRejectBuyer}
          matchStatus={selectedMatch?.status}
        />
      )}
    </div>
  );
}
