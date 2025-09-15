import React, { useEffect, useRef } from 'react';
import { Issue, UserLocation } from '@/types';
import { MapPin } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface MapProps {
  issues: Issue[];
  userLocation: UserLocation | null;
  focusedIssue?: Issue | null;
  className?: string;
}

export const Map: React.FC<MapProps> = ({ issues, userLocation, focusedIssue, className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const { t } = useTranslation();

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return t('submitted');
      case 'in_progress':
        return t('inProgress');
      case 'completed':
        return t('completed');
      default:
        return status;
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');
      
      // Fix default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      
      const defaultCenter = userLocation ? [userLocation.lat, userLocation.lng] : [20.5937, 78.9629];
      
      map.current = L.map(mapContainer.current!, {
        center: defaultCenter as [number, number],
        zoom: userLocation ? 15 : 10,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }).catch(error => {
      console.error('Failed to load Leaflet:', error);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !userLocation) return;

    import('leaflet').then((L) => {
      if (userMarkerRef.current) {
        map.current.removeLayer(userMarkerRef.current);
      }

      // Create custom blue icon for current location
      const currentLocationIcon = L.divIcon({
        html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        className: 'custom-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: currentLocationIcon })
        .addTo(map.current)
        .bindPopup(`📍 ${t('yourLocation')} (Current Location)`);

      map.current.setView([userLocation.lat, userLocation.lng], 15);
    }).catch(error => {
      console.error('Failed to add user marker:', error);
    });
  }, [userLocation, t]);

  useEffect(() => {
    if (!map.current) return;

    import('leaflet').then((L) => {
      markersRef.current.forEach(marker => {
        try {
          map.current.removeLayer(marker);
        } catch (e) {
          console.warn('Failed to remove marker:', e);
        }
      });
      markersRef.current = [];

      if (issues.length === 0) return;

      issues.forEach((issue, index) => {
        const popupContent = `
          <div style="padding: 8px; max-width: 250px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${issue.title}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${issue.category}</p>
            <p style="font-size: 14px; margin-bottom: 8px;">${issue.description}</p>
            <div style="font-size: 11px; color: #888;">
              <div>Status: ${getStatusText(issue.status)}</div>
              <div>Location: ${issue.coordinates.lat.toFixed(4)}, ${issue.coordinates.lng.toFixed(4)}</div>
            </div>
          </div>
        `;

        try {
          // Create custom colored icon based on status
          const getStatusColor = (status: string) => {
            switch (status) {
              case 'submitted': return '#eab308'; // yellow
              case 'in_progress': return '#3b82f6'; // blue
              case 'completed': return '#22c55e'; // green
              default: return '#ef4444'; // red
            }
          };

          const issueIcon = L.divIcon({
            html: `<div style="background-color: ${getStatusColor(issue.status)}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            className: 'custom-div-icon',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          const marker = L.marker([issue.coordinates.lat, issue.coordinates.lng], { icon: issueIcon })
            .addTo(map.current)
            .bindPopup(popupContent, { maxWidth: 300 });

          markersRef.current.push(marker);
        } catch (error) {
          console.error('Failed to add marker:', error);
        }
      });
    }).catch(error => {
      console.error('Failed to load Leaflet for markers:', error);
    });
  }, [issues, t]);

  useEffect(() => {
    if (!map.current || !focusedIssue) return;

    import('leaflet').then(() => {
      map.current.setView([focusedIssue.coordinates.lat, focusedIssue.coordinates.lng], 17);

      const issueIndex = issues.findIndex(issue => issue.id === focusedIssue.id);
      if (issueIndex !== -1 && markersRef.current[issueIndex]) {
        markersRef.current[issueIndex].openPopup();
      }
    });
  }, [focusedIssue, issues]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden border border-border" />
      <div className="absolute top-4 left-4 glass-dark border border-border rounded-lg p-3">
        <h4 className="text-sm font-semibold mb-2 text-foreground">{t('mapLegend')}</h4>
        <div className="flex items-center gap-2 text-sm mb-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs">📍</div>
          <span className="text-foreground">{t('yourLocationMarker')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm mb-1">
          <div className="w-4 h-4 bg-yellow-500 rounded-full border border-white shadow-sm flex items-center justify-center text-xs">⚠️</div>
          <span className="text-foreground">{t('submitted')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm mb-1">
          <div className="w-4 h-4 bg-blue-600 rounded-full border border-white shadow-sm flex items-center justify-center text-xs">🔄</div>
          <span className="text-foreground">{t('inProgress')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-green-500 rounded-full border border-white shadow-sm flex items-center justify-center text-xs">✅</div>
          <span className="text-foreground">{t('completed')}</span>
        </div>
      </div>
    </div>
  );
};