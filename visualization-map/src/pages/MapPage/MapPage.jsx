import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline';

const MapPage = () => {
  const [poly, setPoly] = useState([]);
  const [popupInfo, setPopupInfo] = useState(null);
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
          return (
            <Polyline 
              key={rota.id} 
              pathOptions={{ color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})` }} 
              positions={polylineData} 
              eventHandlers={{
                click: (e) => {
                  setPopupInfo({ position: e.latlng, data: { distanceMeters: rota.distanceMeters, duration: rota.duration }});
                }
              }}
            />
          );
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
            
          const area_kml = data.areas.map((area) => { 
            const positions = area.coords.map(coord => [coord[1], coord[0]]);
            return <Polygon key={area.name} pathOptions={{ color: 'blue' }} positions={positions} />;
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
      {poly}
      {popupInfo && (
        <Popup position={popupInfo.position}>
          <p>{popupInfo.data.distanceMeters} m</p>
          <p>{popupInfo.data.duration}</p> 
        </Popup>
      )}
      {gon}
    </MapContainer>
  );
};

export default MapPage;
