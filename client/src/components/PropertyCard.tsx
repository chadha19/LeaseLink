import { Property } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin, Users } from "lucide-react";

interface PropertyCardProps {
  property: Property & { interestedCount?: number };
  style?: React.CSSProperties;
  className?: string;
}

export default function PropertyCard({ property, style, className = "" }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatAddress = (address: string) => {
    const parts = address.split(',');
    return parts.length > 2 ? `${parts[0]}, ${parts[1]}` : address;
  };

  return (
    <div className={`swipe-card ${className}`} style={style}>
      {property.images && property.images.length > 0 && (
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-80 object-cover"
        />
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-[var(--swipe-secondary)]">{property.title}</h3>
            {property.interestedCount !== undefined && property.interestedCount > 0 && (
              <div className="flex items-center text-sm text-[var(--swipe-accent)] mt-1">
                <Users size={14} className="mr-1" />
                <span>{property.interestedCount} interested</span>
              </div>
            )}
          </div>
          <span className="text-2xl font-bold text-[var(--swipe-primary)]">
            {formatPrice(property.price)}
          </span>
        </div>
        
        <p className="text-[var(--swipe-secondary)] mb-3 flex items-center">
          <MapPin size={16} className="mr-1 text-gray-400" />
          {formatAddress(property.address)}
        </p>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <Bed className="text-[var(--swipe-accent)] mr-1" size={16} />
            <span className="text-sm text-[var(--swipe-secondary)]">{property.bedrooms} Bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <Bath className="text-[var(--swipe-accent)] mr-1" size={16} />
            <span className="text-sm text-[var(--swipe-secondary)]">{property.bathrooms} Bathroom{Number(property.bathrooms) !== 1 ? 's' : ''}</span>
          </div>
          {property.squareFootage && (
            <div className="flex items-center">
              <Square className="text-[var(--swipe-accent)] mr-1" size={16} />
              <span className="text-sm text-[var(--swipe-secondary)]">{property.squareFootage.toLocaleString()} sq ft</span>
            </div>
          )}
        </div>

        {/* Market Data */}
        {(property.marketEstimateMin || property.marketEstimateMax || property.daysOnMarket) && (
          <div className="bg-[var(--swipe-neutral)] rounded-lg p-3 mb-4">
            {(property.marketEstimateMin || property.marketEstimateMax) && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--swipe-secondary)]">Market Estimate:</span>
                <span className="text-[var(--swipe-accent)] font-medium">
                  {property.marketEstimateMin && property.marketEstimateMax 
                    ? `${formatPrice(property.marketEstimateMin)} - ${formatPrice(property.marketEstimateMax)}`
                    : formatPrice(property.marketEstimateMin || property.marketEstimateMax || 0)
                  }
                </span>
              </div>
            )}
            {property.daysOnMarket && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-[var(--swipe-secondary)]">Days on Market:</span>
                <span className="text-[var(--swipe-secondary)]">{property.daysOnMarket} days</span>
              </div>
            )}
          </div>
        )}

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {property.amenities.slice(0, 4).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="property-tag">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 4 && (
              <Badge variant="secondary" className="property-tag">
                +{property.amenities.length - 4} more
              </Badge>
            )}
          </div>
        )}

        {/* Description */}
        {property.description && (
          <p className="text-sm text-gray-600 mt-4 line-clamp-2">
            {property.description}
          </p>
        )}
      </div>
    </div>
  );
}
