import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIconUrl as string,
  shadowUrl: markerShadowUrl as string,
});

const incidents = [
  { id: 1, title: 'Ngập nước', position: [10.777, 106.702], description: 'Khu vực ngập nặng, cần xử lý' },
  { id: 2, title: 'Sập cây', position: [10.775, 106.699], description: 'Cây ngã chắn đường' },
  { id: 3, title: 'Sự cố điện', position: [10.7785, 106.705], description: 'Đứt dây điện, nguy hiểm' },
];

const PublicMapComponent: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    // Thêm 'relative z-0' vào container cha của card để đảm bảo nó nằm đúng lớp
    <div className="mt-6 bg-white rounded-md shadow p-4 relative z-0">
      <div className="text-sm text-gray-600 mb-2">Bản đồ sự cố công cộng</div>

      <div className="relative w-full h-56 rounded overflow-hidden isolate z-0">
        <MapContainer
          ref={mapRef}
          center={[10.776530, 106.700981]}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full"
          style={{ zIndex: 0 }} // Ép cứng style z-index cho container của Leaflet
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {incidents.map((it) => (
            <Marker key={it.id} position={it.position as [number, number]}>
              <Popup>
                <div className="font-semibold">{it.title}</div>
                <div className="text-sm">{it.description}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default PublicMapComponent;