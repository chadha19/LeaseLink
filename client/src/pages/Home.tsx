import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { User } from "@shared/schema";
import Browse from "./Browse";
import LandlordDashboard from "./LandlordDashboard";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: userData } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    enabled: !!user,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--swipe-primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect based on user type
  if (userData?.userType === 'landlord') {
    return <LandlordDashboard />;
  }

  return <Browse />;
}
