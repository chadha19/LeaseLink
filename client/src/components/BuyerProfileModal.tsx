import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, DollarSign, MapPin, Home, Phone, Mail, Calendar, CreditCard } from "lucide-react";
import { User as UserType } from "@shared/schema";

interface BuyerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyerId: string;
  onApprove?: () => void;
  onReject?: () => void;
  matchStatus?: string;
}

export default function BuyerProfileModal({ 
  isOpen, 
  onClose, 
  buyerId, 
  onApprove, 
  onReject, 
  matchStatus 
}: BuyerProfileModalProps) {
  const { data: buyer, isLoading } = useQuery<UserType>({
    queryKey: ["/api/users", buyerId],
    enabled: isOpen && !!buyerId,
  });

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">Loading buyer profile...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!buyer) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center p-8">
            <div className="text-center text-red-600">Unable to load buyer profile</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Buyer Profile
          </DialogTitle>
          <DialogDescription>
            Review the buyer's information to make an informed decision
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Name:</span>
                  <span>{buyer.firstName} {buyer.lastName}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span>{buyer.email}</span>
                </div>
                
                {buyer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span>{buyer.phone}</span>
                  </div>
                )}
                
                {buyer.moveInDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Move-in Date:</span>
                    <span>{formatDate(buyer.moveInDate)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Monthly Income:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(buyer.monthlyIncome)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Credit Score:</span>
                  <span className={`font-semibold ${
                    buyer.creditScore && buyer.creditScore >= 700 
                      ? 'text-green-600' 
                      : buyer.creditScore && buyer.creditScore >= 600
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {buyer.creditScore || "Not provided"}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Budget Range:</span>
                  <span>
                    {formatCurrency(buyer.budgetMin)} - {formatCurrency(buyer.budgetMax)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Housing Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Housing Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {buyer.preferredBedrooms && (
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Preferred Bedrooms:</span>
                    <span>{buyer.preferredBedrooms}</span>
                  </div>
                )}
                
                {buyer.preferredBathrooms && (
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Preferred Bathrooms:</span>
                    <span>{buyer.preferredBathrooms}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Pet Friendly:</span>
                  <Badge variant={buyer.petFriendly ? "default" : "secondary"}>
                    {buyer.petFriendly ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
              
              {buyer.preferredZipCodes && buyer.preferredZipCodes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Preferred Locations:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {buyer.preferredZipCodes.map((zipCode, index) => (
                      <Badge key={index} variant="outline">
                        {zipCode}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {matchStatus === 'pending' && onApprove && onReject && (
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={onApprove}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Approve Application
              </Button>
              <Button 
                onClick={onReject}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              >
                Reject Application
              </Button>
            </div>
          )}
          
          {matchStatus === 'approved' && (
            <div className="text-center py-4">
              <Badge className="bg-green-100 text-green-800">
                Application Approved
              </Badge>
            </div>
          )}
          
          {matchStatus === 'rejected' && (
            <div className="text-center py-4">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Application Rejected
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}