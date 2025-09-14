import { GEOLOCATION_OPTIONS } from '@/config/constants';
import { UserLocation } from '@/types';

export class GeolocationService {
  static getCurrentPosition(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(error);
        },
        GEOLOCATION_OPTIONS
      );
    });
  }

  static watchPosition(
    onSuccess: (location: UserLocation) => void,
    onError: (error: GeolocationPositionError) => void
  ): number {
    if (!navigator.geolocation) {
      onError(new Error('Geolocation not supported') as any);
      return -1;
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        onSuccess({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      onError,
      GEOLOCATION_OPTIONS
    );
  }

  static clearWatch(watchId: number): void {
    navigator.geolocation.clearWatch(watchId);
  }
}