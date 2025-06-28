import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@shared/schema";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { X, Heart } from "lucide-react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function SwipeInterface() {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const swipeMutation = useMutation({
    mutationFn: async ({ propertyId, direction }: { propertyId: string; direction: string }) => {
      const response = await apiRequest("POST", "/api/swipes", { propertyId, direction });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.match) {
        toast({
          title: "🎉 It's a Match!",
          description: "You've been matched with this property. The landlord will review your application.",
          className: "bg-[var(--swipe-accent)] text-white",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
    },
    onError: (error: any) => {
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
      
      // Handle "already swiped" error silently or with less alarming message
      if (error.message && error.message.includes("Already swiped")) {
        // Don't show error for already swiped - just continue to next property
        return;
      }
      
      toast({
        title: "Error",
        description: "Failed to process swipe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating || currentIndex >= properties.length) return;
    
    setIsAnimating(true);
    const currentProperty = properties[currentIndex];
    
    swipeMutation.mutate({
      propertyId: currentProperty.id,
      direction: direction,
    });

    // Animate card out
    x.set(direction === 'right' ? 300 : -300);
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      x.set(0);
      setIsAnimating(false);
    }, 300);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const direction = info.offset.x > threshold ? 'right' : info.offset.x < -threshold ? 'left' : null;
    
    if (direction) {
      handleSwipe(direction);
    } else {
      x.set(0);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--swipe-primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Heart size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No more properties</h3>
          <p className="text-gray-500">Check back later for new listings!</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= properties.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Heart size={48} className="text-[var(--swipe-primary)] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">You've seen all properties!</h3>
          <p className="text-gray-500">Check back later for new listings or adjust your filters.</p>
          <Button 
            className="mt-4 bg-[var(--swipe-primary)] hover:bg-opacity-90"
            onClick={() => setCurrentIndex(0)}
          >
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  const visibleCards = properties.slice(currentIndex, currentIndex + 3);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md mx-auto relative">
        {/* Property Card Stack */}
        <div className="swipe-card-stack" ref={constraintsRef}>
          {visibleCards.map((property, index) => {
            const isTop = index === 0;
            const scale = 1 - index * 0.05;
            const zIndex = visibleCards.length - index;
            
            if (isTop) {
              return (
                <motion.div
                  key={property.id}
                  className="absolute inset-0"
                  style={{
                    x,
                    rotate,
                    opacity,
                    scale,
                    zIndex,
                  }}
                  drag="x"
                  dragConstraints={constraintsRef}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.05 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              );
            }
            
            return (
              <motion.div
                key={property.id}
                className="absolute inset-0"
                style={{
                  scale,
                  zIndex,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale, opacity: 0.5 + index * 0.25 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            );
          })}
        </div>

        {/* Swipe Action Buttons */}
        <div className="flex justify-center space-x-6 mt-8">
          <Button
            className="swipe-button swipe-button-pass"
            onClick={() => handleSwipe('left')}
            disabled={isAnimating || swipeMutation.isPending}
          >
            <X size={24} />
          </Button>
          <Button
            className="swipe-button swipe-button-like"
            onClick={() => handleSwipe('right')}
            disabled={isAnimating || swipeMutation.isPending}
          >
            <Heart size={24} />
          </Button>
        </div>

        {/* Swipe Instructions */}
        <div className="text-center mt-6">
          <p className="text-sm text-[var(--swipe-secondary)]">
            Swipe right to like, left to pass
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {properties.length - currentIndex} properties remaining
          </p>
        </div>
      </div>
    </div>
  );
}
