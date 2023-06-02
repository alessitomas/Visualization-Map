import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline';

const MapPage = () => {
  const [poly, setPoly] = useState([]);
  const [gon, setGon] = useState([]);

  const decodePolyline = (encodedPolyline) => {
    const decodedPolyline = polyline.decode(encodedPolyline);
    const points = decodedPolyline.map((point) => ({ lat: point[0], lng: point[1] }));
    return points;
  };

  useEffect(() => {
    const fetchPolylineData = async () => {
      try {
        const response = await fetch('http://localhost:5000/rota');
        const data = await response.json();

        const polylines = data.rotas.map((rota) => {
          const polylineData = decodePolyline(rota.encodedRoutes);
          return <Polyline key={rota.id} pathOptions={{ color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})` }} positions={polylineData} />;
        });

        setPoly(polylines);
      } catch (error) {
        console.error('Error fetching polyline data:', error);
      }
    };

    const fetchAreaData = async () => {
        try {
          const response = await fetch('http://localhost:5000/areas');
          const data = await response.json();
            
        //   how do i read this ??
          const area_kml = data.areas.map((area) => { 
            return <Polygon key={area.name} pathOptions={{ color: 'blue' }} positions={area.coords} />;
          });

          setGon(area_kml);
        } catch (error) {
          console.error('Error fetching areas data:', error);
        }
      };

    fetchPolylineData();
    fetchAreaData();
  }, []);

  const center = [-23.513860, -46.597593];

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {poly}{gon}
    </MapContainer>
  );
}

export default MapPage;
