import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Heart, MessageCircle, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-[var(--swipe-primary)]">
                <Home className="inline mr-2" size={28} />
                LeaseLink
              </div>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/api/auth/google'}
              className="bg-[var(--swipe-primary)] hover:bg-opacity-90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect Home with a Simple Swipe
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The modern way to discover properties. Swipe through curated listings, 
            match with landlords, and start conversations about your next home.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/auth/google'}
              className="bg-[var(--swipe-primary)] hover:bg-opacity-90 px-8 py-4 text-lg"
            >
              Start Browsing Properties
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/api/auth/google'}
              className="px-8 py-4 text-lg border-[var(--swipe-primary)] text-[var(--swipe-primary)] hover:bg-[var(--swipe-primary)] hover:text-white"
            >
              List Your Property
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How SwipeHousing Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-red-500" />
                </div>
                <CardTitle>Browse Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Swipe through curated property listings that match your preferences. 
                  See detailed information, photos, and market data for each property.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-teal-600" />
                </div>
                <CardTitle>Match with Landlords</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  When you like a property, landlords can approve your interest to create a match. 
                  Only mutual matches can start conversations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>Start Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Chat directly with landlords, ask questions, schedule viewings, 
                  and negotiate terms in real-time messaging.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                For Renters & Buyers
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Shield className="w-6 h-6 text-[var(--swipe-accent)] mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Verified Listings</h3>
                    <p className="text-gray-600">All properties are verified and quality-checked by landlords</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Heart className="w-6 h-6 text-[var(--swipe-primary)] mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Smart Matching</h3>
                    <p className="text-gray-600">Only see properties that match your budget and preferences</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MessageCircle className="w-6 h-6 text-purple-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Direct Communication</h3>
                    <p className="text-gray-600">Skip the middleman and talk directly with property owners</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                For Landlords & Sellers
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Shield className="w-6 h-6 text-[var(--swipe-accent)] mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Pre-qualified Tenants</h3>
                    <p className="text-gray-600">Only matched tenants who meet your criteria can contact you</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Heart className="w-6 h-6 text-[var(--swipe-primary)] mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Easy Management</h3>
                    <p className="text-gray-600">Manage all your listings and applications in one place</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MessageCircle className="w-6 h-6 text-purple-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Market Insights</h3>
                    <p className="text-gray-600">Get insights from tenant interest and application data</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--swipe-primary)] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have found their ideal homes through SwipeHousing
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/auth/google'}
            className="bg-white text-[var(--swipe-primary)] hover:bg-gray-100 px-8 py-4 text-lg"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Home className="mr-2" size={28} />
            <span className="text-2xl font-bold">SwipeHousing</span>
          </div>
          <p className="text-gray-400">
            The modern way to find your perfect home. Swipe. Match. Move in.
          </p>
        </div>
      </footer>
    </div>
  );
}
