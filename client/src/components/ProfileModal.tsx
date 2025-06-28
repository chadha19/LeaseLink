import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X, User as UserIcon, Home, DollarSign, MapPin, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: userData, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    enabled: isOpen && !!user,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    userType: "buyer",
    monthlyIncome: "",
    creditScore: "",
    budgetMin: "",
    budgetMax: "",
    preferredZipCodes: [] as string[],
    preferredBedrooms: "",
    preferredBathrooms: "",
    petFriendly: false,
    moveInDate: "",
  });

  const [zipCodeInput, setZipCodeInput] = useState("");

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        userType: userData.userType || "buyer",
        monthlyIncome: userData.monthlyIncome?.toString() || "",
        creditScore: userData.creditScore?.toString() || "",
        budgetMin: userData.budgetMin?.toString() || "",
        budgetMax: userData.budgetMax?.toString() || "",
        preferredZipCodes: userData.preferredZipCodes || [],
        preferredBedrooms: userData.preferredBedrooms?.toString() || "",
        preferredBathrooms: userData.preferredBathrooms?.toString() || "",
        petFriendly: userData.petFriendly || false,
        moveInDate: userData.moveInDate ? new Date(userData.moveInDate).toISOString().split('T')[0] : "",
      });
    }
  }, [userData]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PATCH", "/api/user/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onClose();
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
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      monthlyIncome: formData.monthlyIncome ? parseInt(formData.monthlyIncome) : null,
      creditScore: formData.creditScore ? parseInt(formData.creditScore) : null,
      budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) : null,
      budgetMax: formData.budgetMax ? parseInt(formData.budgetMax) : null,
      preferredBedrooms: formData.preferredBedrooms ? parseInt(formData.preferredBedrooms) : null,
      preferredBathrooms: formData.preferredBathrooms ? parseInt(formData.preferredBathrooms) : null,
      moveInDate: formData.moveInDate ? new Date(formData.moveInDate) : null,
    };

    updateProfileMutation.mutate(submitData);
  };

  const addZipCode = () => {
    if (zipCodeInput.trim() && !formData.preferredZipCodes.includes(zipCodeInput.trim())) {
      setFormData(prev => ({
        ...prev,
        preferredZipCodes: [...prev.preferredZipCodes, zipCodeInput.trim()]
      }));
      setZipCodeInput("");
    }
  };

  const removeZipCode = (zipCode: string) => {
    setFormData(prev => ({
      ...prev,
      preferredZipCodes: prev.preferredZipCodes.filter(z => z !== zipCode)
    }));
  };

  const handleZipCodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addZipCode();
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--swipe-primary)] mx-auto mb-2"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[var(--swipe-secondary)] flex items-center">
            <UserIcon className="mr-2" size={24} />
            Profile Settings
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserIcon className="mr-2" size={20} />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="userType">Account Type</Label>
                    <Select value={formData.userType} onValueChange={(value) => setFormData(prev => ({ ...prev, userType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Buyer/Renter</SelectItem>
                        <SelectItem value="landlord">Landlord/Seller</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-4">
              {formData.userType === 'buyer' && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <DollarSign className="mr-2" size={20} />
                        Budget & Financial Information
                      </CardTitle>
                      <CardDescription>
                        Help us find properties within your budget
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="monthlyIncome">Monthly Income</Label>
                        <Input
                          id="monthlyIncome"
                          type="number"
                          value={formData.monthlyIncome}
                          onChange={(e) => setFormData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                          placeholder="Enter monthly income"
                        />
                      </div>
                      <div>
                        <Label htmlFor="creditScore">Credit Score (Optional)</Label>
                        <Input
                          id="creditScore"
                          type="number"
                          min="300"
                          max="850"
                          value={formData.creditScore}
                          onChange={(e) => setFormData(prev => ({ ...prev, creditScore: e.target.value }))}
                          placeholder="Enter credit score"
                        />
                      </div>
                      <div>
                        <Label htmlFor="budgetMin">Minimum Budget</Label>
                        <Input
                          id="budgetMin"
                          type="number"
                          value={formData.budgetMin}
                          onChange={(e) => setFormData(prev => ({ ...prev, budgetMin: e.target.value }))}
                          placeholder="Minimum rent/price"
                        />
                      </div>
                      <div>
                        <Label htmlFor="budgetMax">Maximum Budget</Label>
                        <Input
                          id="budgetMax"
                          type="number"
                          value={formData.budgetMax}
                          onChange={(e) => setFormData(prev => ({ ...prev, budgetMax: e.target.value }))}
                          placeholder="Maximum rent/price"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Home className="mr-2" size={20} />
                        Property Preferences
                      </CardTitle>
                      <CardDescription>
                        Tell us what you're looking for in a property
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="preferredBedrooms">Preferred Bedrooms</Label>
                          <Select value={formData.preferredBedrooms} onValueChange={(value) => setFormData(prev => ({ ...prev, preferredBedrooms: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bedrooms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Bedroom</SelectItem>
                              <SelectItem value="2">2 Bedrooms</SelectItem>
                              <SelectItem value="3">3 Bedrooms</SelectItem>
                              <SelectItem value="4">4+ Bedrooms</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="preferredBathrooms">Preferred Bathrooms</Label>
                          <Select value={formData.preferredBathrooms} onValueChange={(value) => setFormData(prev => ({ ...prev, preferredBathrooms: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bathrooms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Bathroom</SelectItem>
                              <SelectItem value="2">2 Bathrooms</SelectItem>
                              <SelectItem value="3">3+ Bathrooms</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="moveInDate">Desired Move-in Date</Label>
                        <Input
                          id="moveInDate"
                          type="date"
                          value={formData.moveInDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, moveInDate: e.target.value }))}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="petFriendly"
                          checked={formData.petFriendly}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, petFriendly: !!checked }))}
                        />
                        <Label htmlFor="petFriendly">Pet-friendly properties only</Label>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="mr-2" size={20} />
                        Preferred Locations
                      </CardTitle>
                      <CardDescription>
                        Add ZIP codes or areas you're interested in
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          value={zipCodeInput}
                          onChange={(e) => setZipCodeInput(e.target.value)}
                          onKeyPress={handleZipCodeKeyPress}
                          placeholder="Enter ZIP code"
                          maxLength={5}
                        />
                        <Button type="button" onClick={addZipCode} variant="outline">
                          Add
                        </Button>
                      </div>
                      {formData.preferredZipCodes.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.preferredZipCodes.map((zipCode) => (
                            <Badge key={zipCode} variant="secondary" className="flex items-center gap-1">
                              {zipCode}
                              <X 
                                size={14} 
                                className="cursor-pointer hover:text-red-500" 
                                onClick={() => removeZipCode(zipCode)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}

              {formData.userType === 'landlord' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Landlord Information</CardTitle>
                    <CardDescription>
                      Additional information for property owners
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      As a landlord, you can manage your properties from the dashboard. 
                      Use the "Add Property" button to list new properties and manage applications.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Management</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Account Status</h4>
                      <p className="text-sm text-gray-600">Your account is active and verified</p>
                    </div>
                    <Badge className="bg-[var(--swipe-accent)] text-white">Active</Badge>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="userType">Account Type</Label>
                    <Select 
                      value={formData.userType} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, userType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Buyer/Renter</SelectItem>
                        <SelectItem value="landlord">Landlord/Property Owner</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-600">
                      {formData.userType === 'buyer' 
                        ? 'Search for properties and connect with landlords' 
                        : 'List properties and manage tenant applications'
                      }
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateProfileMutation.isPending}
              className="bg-[var(--swipe-primary)] hover:bg-opacity-90"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
