import { useState, useEffect } from 'react';
import { UserLocation } from '@/types';

export const useGeolocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setError(null);
      setLoading(false);
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message);
      setLoading(false);
    };

    // Try multiple times for better accuracy
    const tryGetLocation = (attempt = 1) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // If accuracy is poor and we haven't tried 3 times, try again
          if (position.coords.accuracy > 1000 && attempt < 3) {
            setTimeout(() => tryGetLocation(attempt + 1), 1000);
            return;
          }
          handleSuccess(position);
        },
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 30000, // Longer timeout
          maximumAge: 0, // Always get fresh location
        }
      );
    };

    tryGetLocation();
  }, []);

  return { location, error, loading };
};