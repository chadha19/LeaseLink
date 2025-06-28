import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { insertPropertySchema } from "@shared/schema";
import { z } from "zod";
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
import { X, Home, DollarSign, MapPin, Camera, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const amenityOptions = [
  "Pet Friendly",
  "Parking",
  "Laundry",
  "Air Conditioning",
  "Gym",
  "Pool",
  "Balcony",
  "Dishwasher",
  "Hardwood Floors",
  "In-unit Washer/Dryer",
  "Doorman",
  "Elevator",
  "Outdoor Space",
  "Storage",
  "Bike Storage",
  "Roof Deck"
];

const leaseTermOptions = [
  "Month-to-Month",
  "6 Months",
  "12 Months",
  "18 Months",
  "24 Months",
  "Flexible"
];

export default function AddPropertyModal({ isOpen, onClose }: AddPropertyModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    zipCode: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    leaseTerms: "",
    moveInDate: "",
    description: "",
    amenities: [] as string[],
    images: [] as string[],
    minCreditScore: "",
    autoReject: false,
  });

  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingFile, setUploadingFile] = useState(false);

  const createPropertyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/properties", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties/my"] });
      toast({
        title: "Success",
        description: "Property added successfully!",
      });
      onClose();
      resetForm();
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
        description: "Failed to create property. Please check your inputs.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      address: "",
      zipCode: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      squareFootage: "",
      leaseTerms: "",
      moveInDate: "",
      description: "",
      amenities: [],
      images: [],
      minCreditScore: "",
      autoReject: false,
    });
    setImageUrl("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.bedrooms) newErrors.bedrooms = "Number of bedrooms is required";
    if (!formData.bathrooms) newErrors.bathrooms = "Number of bathrooms is required";

    // Validate ZIP code format
    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = "Invalid ZIP code format";
    }

    // Validate price
    if (formData.price && (isNaN(Number(formData.price)) || Number(formData.price) <= 0)) {
      newErrors.price = "Price must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Authentication Error", 
        description: "You must be logged in to create a property",
        variant: "destructive",
      });
      return;
    }

    console.log("Current user:", user); // Debug log

    try {
      const submitData = {
        landlordId: user.id.toString(),
        title: formData.title.trim(),
        address: formData.address.trim(),
        zipCode: formData.zipCode.trim(),
        price: parseInt(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: formData.bathrooms, // Keep as string for schema validation
        squareFootage: formData.squareFootage ? parseInt(formData.squareFootage) : undefined,
        leaseTerms: formData.leaseTerms || undefined,
        moveInDate: formData.moveInDate ? new Date(formData.moveInDate) : undefined,
        description: formData.description.trim() || undefined,
        amenities: formData.amenities,
        images: formData.images,
        minCreditScore: formData.minCreditScore ? parseInt(formData.minCreditScore) : undefined,
        autoReject: formData.autoReject,
        marketEstimateMin: Math.floor(parseInt(formData.price) * 0.9),
        marketEstimateMax: Math.floor(parseInt(formData.price) * 1.1),
        daysOnMarket: Math.floor(Math.random() * 30) + 1,
      };

      // Validate with schema
      insertPropertySchema.parse(submitData);
      createPropertyMutation.mutate(submitData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        console.log("Validation errors:", error.errors);
        toast({
          title: "Validation Error",
          description: `Please check your inputs: ${error.errors.map(e => e.message).join(', ')}`,
          variant: "destructive",
        });
      } else {
        console.error("Property creation error:", error);
        toast({
          title: "Error",
          description: "Failed to create property. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const addImage = () => {
    const url = imageUrl.trim();
    
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.images.includes(url)) {
      toast({
        title: "Error",
        description: "This image URL has already been added",
        variant: "destructive",
      });
      return;
    }
    
    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
    setImageUrl("");
    
    toast({
      title: "Success",
      description: "Image added successfully",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingFile(true);

    // Convert file to base64 data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      if (formData.images.includes(dataUrl)) {
        toast({
          title: "Error",
          description: "This image has already been added",
          variant: "destructive",
        });
        setUploadingFile(false);
        return;
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, dataUrl]
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      
      setUploadingFile(false);
      // Reset the input
      event.target.value = '';
    };

    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read the image file",
        variant: "destructive",
      });
      setUploadingFile(false);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== image)
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addImage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[var(--swipe-secondary)] flex items-center">
            <Home className="mr-2" size={24} />
            Add New Property
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="images">Photos</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="mr-2" size={20} />
                    Property Information
                  </CardTitle>
                  <CardDescription>
                    Basic details about your property
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Modern 2BR in Manhattan"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Full Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="e.g., 123 Main St, New York, NY"
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                        placeholder="12345"
                        maxLength={10}
                        className={errors.zipCode ? "border-red-500" : ""}
                      />
                      {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Monthly Rent/Price *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="3000"
                          className={`pl-10 ${errors.price ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                    </div>
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms *</Label>
                      <Select value={formData.bedrooms} onValueChange={(value) => setFormData(prev => ({ ...prev, bedrooms: value }))}>
                        <SelectTrigger className={errors.bedrooms ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Studio</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.bedrooms && <p className="text-sm text-red-500 mt-1">{errors.bedrooms}</p>}
                    </div>
                    <div>
                      <Label htmlFor="bathrooms">Bathrooms *</Label>
                      <Select value={formData.bathrooms} onValueChange={(value) => setFormData(prev => ({ ...prev, bathrooms: value }))}>
                        <SelectTrigger className={errors.bathrooms ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="1.5">1.5</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="2.5">2.5</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="3.5">3.5</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.bathrooms && <p className="text-sm text-red-500 mt-1">{errors.bathrooms}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                  <CardDescription>
                    Additional information about your property
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="squareFootage">Square Footage</Label>
                      <Input
                        id="squareFootage"
                        type="number"
                        value={formData.squareFootage}
                        onChange={(e) => setFormData(prev => ({ ...prev, squareFootage: e.target.value }))}
                        placeholder="1200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="leaseTerms">Lease Terms</Label>
                      <Select value={formData.leaseTerms} onValueChange={(value) => setFormData(prev => ({ ...prev, leaseTerms: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lease terms" />
                        </SelectTrigger>
                        <SelectContent>
                          {leaseTermOptions.map((term) => (
                            <SelectItem key={term} value={term}>{term}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="moveInDate">Available Move-in Date</Label>
                    <Input
                      id="moveInDate"
                      type="date"
                      value={formData.moveInDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, moveInDate: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Property Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your property, highlight key features, neighborhood details, etc."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {amenityOptions.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity}
                            checked={formData.amenities.includes(amenity)}
                            onCheckedChange={() => toggleAmenity(amenity)}
                            className="data-[state=checked]:bg-[var(--swipe-primary)] data-[state=checked]:border-[var(--swipe-primary)]"
                          />
                          <Label htmlFor={amenity} className="text-sm">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="mr-2" size={20} />
                    Property Photos
                  </CardTitle>
                  <CardDescription>
                    Add photos to showcase your property. Use high-quality images for better results.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* URL Input Method */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Add from URL</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyPress={handleImageKeyPress}
                        placeholder="Enter image URL (https://...)"
                        className="flex-1"
                      />
                      <Button type="button" onClick={addImage} variant="outline">
                        <Plus size={16} className="mr-1" />
                        Add URL
                      </Button>
                    </div>
                  </div>

                  {/* File Upload Method */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Upload from Computer</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="flex-1"
                        disabled={uploadingFile}
                      />
                      {uploadingFile && (
                        <span className="text-sm text-gray-500">Uploading...</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: JPG, PNG, GIF, WebP (max 5MB)
                    </p>
                  </div>

                  {formData.images.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Added Images ({formData.images.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image} 
                              alt={`Property ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(image)}
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.images.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <Camera size={32} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No images added yet</p>
                      <p className="text-sm text-gray-400">Add image URLs above to showcase your property</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Requirements Tab */}
            <TabsContent value="requirements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tenant Requirements</CardTitle>
                  <CardDescription>
                    Set requirements and filters for potential tenants
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="minCreditScore">Minimum Credit Score</Label>
                    <Input
                      id="minCreditScore"
                      type="number"
                      min="300"
                      max="850"
                      value={formData.minCreditScore}
                      onChange={(e) => setFormData(prev => ({ ...prev, minCreditScore: e.target.value }))}
                      placeholder="e.g., 650"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Leave empty if you don't want to set a minimum credit score requirement
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="autoReject"
                      checked={formData.autoReject}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoReject: !!checked }))}
                      className="data-[state=checked]:bg-[var(--swipe-primary)] data-[state=checked]:border-[var(--swipe-primary)]"
                    />
                    <Label htmlFor="autoReject">
                      Automatically reject applications that don't meet credit score requirement
                    </Label>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Fair Housing Notice</h4>
                    <p className="text-sm text-yellow-700">
                      All requirements must comply with fair housing laws. You cannot discriminate based on 
                      race, color, religion, sex, national origin, familial status, or disability.
                    </p>
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
              disabled={createPropertyMutation.isPending}
              className="bg-[var(--swipe-primary)] hover:bg-opacity-90"
            >
              {createPropertyMutation.isPending ? "Creating..." : "Create Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
