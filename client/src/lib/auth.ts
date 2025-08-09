// Auth utility functions
export function getGoogleAuthUrl(): string {
  // For Railway production deployment
  if (import.meta.env.PROD && window.location.hostname.includes('railway.app')) {
    return `https://${window.location.hostname}/api/auth/google`;
  }
  
  // For other production deployments (custom domains, etc)
  if (import.meta.env.PROD) {
    return `https://${window.location.hostname}/api/auth/google`;
  }
  
  // For development (relative URL)
  return '/api/auth/google';
}

export function getLogoutUrl(): string {
  // For Railway production deployment
  if (import.meta.env.PROD && window.location.hostname.includes('railway.app')) {
    return `https://${window.location.hostname}/api/logout`;
  }
  
  // For other production deployments
  if (import.meta.env.PROD) {
    return `https://${window.location.hostname}/api/logout`;
  }
  
  // For development
  return '/api/logout';
}