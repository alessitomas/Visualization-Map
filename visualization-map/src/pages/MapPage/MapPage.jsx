import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline';

const MapPage = () => {
  const [poly, setPoly] = useState([]);

  useEffect(() => {
    const fetchPolylineData = async () => {
      try {
        const response = await fetch('http://localhost:5000/rota');
        const data = await response.json();

        const decodePolyline = (encodedPolyline) => {
          const decodedPolyline = polyline.decode(encodedPolyline);
          const points = decodedPolyline.map((point) => ({ lat: point[0], lng: point[1] }));
          return points;
        };
        const polylines = data.rotas.map((rota) => {
          const polylineData = decodePolyline(rota.encodedRoutes);
          return <Polyline key={rota.id} pathOptions={{ color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})` }} positions={polylineData} />;
        });

        setPoly(polylines);
      } catch (error) {
        console.error('Error fetching polyline data:', error);
      }
    };

    fetchPolylineData();
  }, []);

  const center = [-23.513860, -46.597593];

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {poly}
    </MapContainer>
  );
}

export default MapPage;
