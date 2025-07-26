// Google Maps service for location validation
export class GoogleMapsService {
  static async validateAddress(address: string) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.log('Google Maps API key not configured, skipping validation');
      return { isValid: true, coordinates: null, formattedAddress: null };
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Google Maps API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        isValid: data.status === 'OK' && data.results.length > 0,
        coordinates: data.results[0]?.geometry?.location || null,
        formattedAddress: data.results[0]?.formatted_address || null,
      };
    } catch (error) {
      console.error('Google Maps API error:', error);
      throw error;
    }
  }
}