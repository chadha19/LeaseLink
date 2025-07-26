import { API_KEYS, getApiKey, hasApiKey } from "../api-keys";



// Google Maps service for location validation
export class GoogleMapsService {
  static async validateAddress(address: string) {
    if (!hasApiKey('GOOGLE_MAPS_API_KEY')) {
      console.log('Google Maps API key not configured, skipping validation');
      return { isValid: true, coordinates: null };
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${getApiKey('GOOGLE_MAPS_API_KEY')}`
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

// Twilio service for SMS notifications
export class TwilioService {
  static async sendSMS(to: string, message: string) {
    if (!hasApiKey('TWILIO_ACCOUNT_SID') || !hasApiKey('TWILIO_AUTH_TOKEN')) {
      console.log('Twilio API keys not configured, skipping SMS');
      return { success: false, message: 'SMS service not configured' };
    }

    try {
      const accountSid = getApiKey('TWILIO_ACCOUNT_SID');
      const authToken = getApiKey('TWILIO_AUTH_TOKEN');
      const fromNumber = getApiKey('TWILIO_PHONE_NUMBER');

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: to,
          Body: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Twilio API error: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, messageId: data.sid };
    } catch (error) {
      console.error('Twilio SMS error:', error);
      throw error;
    }
  }
}

// Cloudinary service for image uploads
export class CloudinaryService {
  static async uploadImage(imageData: string, filename: string) {
    if (!hasApiKey('CLOUDINARY_CLOUD_NAME') || !hasApiKey('CLOUDINARY_API_KEY')) {
      console.log('Cloudinary API keys not configured, using local storage');
      return { success: true, url: imageData }; // Return the base64 data URL
    }

    try {
      const cloudName = getApiKey('CLOUDINARY_CLOUD_NAME');
      const apiKey = getApiKey('CLOUDINARY_API_KEY');
      const apiSecret = getApiKey('CLOUDINARY_API_SECRET');

      const timestamp = Math.round(Date.now() / 1000);
      const signature = require('crypto')
        .createHash('sha1')
        .update(`timestamp=${timestamp}${apiSecret}`)
        .digest('hex');

      const formData = new FormData();
      formData.append('file', imageData);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', apiKey);
      formData.append('signature', signature);
      formData.append('folder', 'swipehousing');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Cloudinary API error: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, url: data.secure_url, publicId: data.public_id };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }
}