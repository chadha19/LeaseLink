import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FilterState {
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  amenities: string[];
}

export default function FilterSidebar() {
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    amenities: [],
  });

  const bedroomOptions = ["Any", "1+", "2+", "3+", "4+"];
  const amenityOptions = [
    "Pet Friendly",
    "Parking",
    "Laundry",
    "Air Conditioning",
    "Gym",
    "Pool",
    "Balcony",
    "Dishwasher"
  ];

  const handleBedroomSelect = (bedroom: string) => {
    setFilters(prev => ({ ...prev, bedrooms: bedroom }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleApplyFilters = () => {
    // TODO: Implement filter application
    console.log("Applying filters:", filters);
  };

  const handleClearFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      amenities: [],
    });
  };

  return (
    <div className="hidden lg:block w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <Card className="border-0 rounded-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[var(--swipe-secondary)]">
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Location Filter */}
          <div>
            <Label htmlFor="location" className="text-sm font-medium text-[var(--swipe-secondary)] mb-2">
              Location
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="Enter city or ZIP code"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full"
            />
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium text-[var(--swipe-secondary)] mb-2">
              Price Range
            </Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                className="w-1/2"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="w-1/2"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <Label className="text-sm font-medium text-[var(--swipe-secondary)] mb-2">
              Bedrooms
            </Label>
            <div className="flex flex-wrap gap-2">
              {bedroomOptions.map((option) => (
                <Button
                  key={option}
                  variant={filters.bedrooms === option ? "default" : "outline"}
                  size="sm"
                  className={`filter-button ${
                    filters.bedrooms === option 
                      ? 'bg-[var(--swipe-primary)] text-white border-[var(--swipe-primary)]' 
                      : ''
                  }`}
                  onClick={() => handleBedroomSelect(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label className="text-sm font-medium text-[var(--swipe-secondary)] mb-2">
              Amenities
            </Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {amenityOptions.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                    className="data-[state=checked]:bg-[var(--swipe-primary)] data-[state=checked]:border-[var(--swipe-primary)]"
                  />
                  <Label htmlFor={amenity} className="text-sm text-[var(--swipe-secondary)]">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={handleApplyFilters}
              className="w-full bg-[var(--swipe-primary)] hover:bg-opacity-90"
            >
              Apply Filters
            </Button>
            <Button 
              variant="outline"
              onClick={handleClearFilters}
              className="w-full"
            >
              Clear All
            </Button>
          </div>

          {/* Active Filters Count */}
          {(filters.location || filters.minPrice || filters.maxPrice || filters.bedrooms || filters.amenities.length > 0) && (
            <div className="text-xs text-gray-500 text-center">
              {[
                filters.location,
                filters.minPrice || filters.maxPrice,
                filters.bedrooms,
                ...filters.amenities
              ].filter(Boolean).length} filter(s) active
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
