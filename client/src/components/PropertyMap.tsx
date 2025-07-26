import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyMapProps {
  address: string;
  latitude?: string | null;
  longitude?: string | null;
  title?: string;
}

export default function PropertyMap({ address, latitude, longitude, title }: PropertyMapProps) {
  const [showMap, setShowMap] = useState(false);

  // If we have coordinates, use them for a more accurate map
  const mapQuery = latitude && longitude 
    ? `${latitude},${longitude}`
    : encodeURIComponent(address);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;
  const embeddedMapUrl = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${mapQuery}`;

  if (!showMap) {
    return (
      <Button
        variant="outline"
        onClick={() => setShowMap(true)}
        className="w-full flex items-center gap-2"
      >
        <MapPin className="w-4 h-4" />
        View on Map
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMap(false)}
        >
          Hide Map
        </Button>
      </div>
      
      <div className="relative">
        {/* Embedded Google Map */}
        {googleMapsApiKey ? (
          <iframe
            src={embeddedMapUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          />
        ) : (
          <div className="h-300 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">Map preview not available</p>
              <p className="text-sm text-gray-500">Google Maps API key needed</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">{address}</span>
        <Button
          variant="ghost"
          size="sm"
          asChild
        >
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Open in Google Maps
          </a>
        </Button>
      </div>
      
      {latitude && longitude && (
        <p className="text-xs text-gray-500">
          Coordinates: {parseFloat(latitude).toFixed(6)}, {parseFloat(longitude).toFixed(6)}
        </p>
      )}
    </div>
  );
}