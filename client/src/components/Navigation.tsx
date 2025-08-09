import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Home, Bell } from "lucide-react";
import { getLogoutUrl } from "@/lib/auth";

interface NavigationProps {
  onProfileClick?: () => void;
}

export default function Navigation({ onProfileClick }: NavigationProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  
  const { data: userData } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    enabled: !!user,
  });

  const isLandlord = userData?.userType === 'landlord';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-[var(--swipe-primary)]">
              <Home className="inline mr-2" size={28} />
              LeaseLink
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {isLandlord ? (
              <>
                <Link href="/landlord" className={`nav-link ${location === '/landlord' ? 'text-[var(--swipe-primary)]' : ''}`}>
                  Dashboard
                </Link>
                <Link href="/matches" className={`nav-link ${location === '/matches' ? 'text-[var(--swipe-primary)]' : ''}`}>
                  Applications
                </Link>
              </>
            ) : (
              <>
                <Link href="/browse" className={`nav-link ${location === '/browse' || location === '/' ? 'text-[var(--swipe-primary)]' : ''}`}>
                  Browse Properties
                </Link>
                <Link href="/matches" className={`nav-link ${location === '/matches' ? 'text-[var(--swipe-primary)]' : ''}`}>
                  Matches
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell size={20} />
            </Button>
            
            {userData?.profileImageUrl ? (
              <img 
                src={userData.profileImageUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-[var(--swipe-primary)] transition-all"
                onClick={onProfileClick}
              />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onProfileClick}
                className="w-10 h-10 rounded-full bg-[var(--swipe-primary)] text-white"
              >
                {userData?.firstName?.charAt(0) || userData?.email?.charAt(0) || 'U'}
              </Button>
            )}
            
            <Button 
              variant="outline"
              size="sm"
              onClick={() => window.location.href = getLogoutUrl()}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
