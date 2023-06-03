import { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, useMap, TileLayer, Polyline, Popup, Polygon, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline';

const MapPage = () => {
  const [poly, setPoly] = useState([]);
  const [popupInfo, setPopupInfo] = useState(null);
  const [gon, setGon] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState([-23.513860, -46.597593]);
  const [mapZoom, setMapZoom] = useState(13);
  const mapRef = useRef();

  const decodePolyline = (encodedPolyline) => {
    const decodedPolyline = polyline.decode(encodedPolyline);
    return decodedPolyline.map((point) => ({ lat: point[0], lng: point[1] }));
  };

  const MapEvents = () => {
    const map = useMap();

    useEffect(() => {
      mapRef.current = map;
    }, [map]);

    useEffect(() => {
      if (!mapRef.current) return;

      const handleMove = () => {
        setMapCenter(mapRef.current.getCenter());
        setMapZoom(mapRef.current.getZoom());
      };

      mapRef.current.on('moveend', handleMove);

      return () => {
        mapRef.current.off('moveend', handleMove);
      };
    }, [mapRef]);

    return null;
  };

  useEffect(() => {

    const fetchPolylineData = async () => {
      try {
        const response = await fetch('http://localhost:5000/rota');
        const data = await response.json();
        setPoly(data.rotas);
        setMarkers(data.rotas);
      } catch (error) {
        console.error('Error fetching polyline data:', error);
      }
    };

    const fetchAreaData = async () => {
      try {
        const response = await fetch('http://localhost:5000/areas');
        const data = await response.json();
        setGon(data.areas);
      } catch (error) {
        console.error('Error fetching areas data:', error);
      }
    };

    fetchPolylineData();
    fetchAreaData();
  }, [mapCenter, mapZoom]);

  const polylines = useMemo(() => poly.map((rota) => {
    const polylineData = decodePolyline(rota.encodedRoutes);
    return (
      <Polyline 
        key={rota.id} map
        pathOptions={{ color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})` }} 
        positions={polylineData} 
        eventHandlers={{
          click: (e) => {
            setPopupInfo({ position: e.latlng, data: { distanceMeters: rota.distanceMeters, duration: rota.duration }});
          }
        }}
      />
    );
  }), [poly]);

  const markersElements = useMemo(() => markers.flatMap((rota) => ([
    <Marker key={`origin-${rota.id}`} position={[rota.latitudeOrigem, rota.longitudeOrigem]}>
      <Popup>
        Origem<br />
        Lat: {rota.latitudeOrigem}<br />
        Lng: {rota.longitudeOrigem}<br />
        </Popup>
    </Marker>,
    <Marker key={`destination-${rota.id}`} position={[rota.latitudeDestino, rota.longitudeDestino]}>
    <Popup>
        Destino<br />
        Lat: {rota.latitudeDestino}<br />
        Lng: {rota.longitudeDestino}<br />
    </Popup>
    </Marker>

    ])), [markers]);

    const polygons = useMemo(() => gon.map((area) => {
    const positions = area.coords.map(coord => [coord[1], coord[0]]);
    return <Polygon key={area.name} pathOptions={{ color: 'blue' }} positions={positions} />;
    }), [gon]);

    return (
        <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true}>
        <MapEvents />
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {polylines}
        {popupInfo && (
        <Popup position={popupInfo.position}>
        Distancia: {popupInfo.data.distanceMeters} m <br />
        Tempo: {popupInfo.data.duration}
        </Popup>
        )}
        {polygons}
        {markersElements}
        </MapContainer>
    );
};

export default MapPage;