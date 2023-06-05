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
  const [travelMode, setTravelMode] = useState(null);
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
        const response = await fetch(`http://localhost:5000/rota${travelMode ? `?travelMode=${travelMode}` : ''}`, { mode: 'cors' });
        const data = await response.json();
        setPoly(data.rotas);
        setMarkers(data.rotas);
      } catch (error) {
        console.error('Error fetching polyline data:', error);
      }
    };

    const fetchAreaData = async () => {
      try {
        const response = await fetch('http://localhost:5000/areas', { mode: 'cors' });
        const data = await response.json();
        setGon(data.areas);
      } catch (error) {
        console.error('Error fetching areas data:', error);
      }
    };

    fetchPolylineData();
    fetchAreaData();
  }, [mapCenter, mapZoom, travelMode]);

  function random(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
    }

  const polylines = useMemo(() => poly.map((rota) => {
    const polylineData = decodePolyline(rota.encodedRoutes);

    var seed = rota.id + 2;
    
    return (
      <Polyline 
        key={rota.id} map
        pathOptions={{ color: `rgb(${Math.floor(random(seed) * 255 )},${Math.floor(random(seed+1) * 255)},${Math.floor(random(seed-1) * 255)})` }} 
        positions={polylineData} 
        eventHandlers={{
          click: (e) => {
            setPopupInfo({ position: e.latlng, data: { distanceMeters: rota.distanceMeters, duration: rota.duration } });
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
    return <Polygon key={area.name} pathOptions={{ color: 'white', opacity:0.5, fillColor:'black', fillOpacity:0.25, weight:2  }} positions={positions} />;
  }), [gon]);

  return (
    <div id="centralize">
      <div id="title">
        <h1> <img id="icon-size" src="https://primedepartamentos.com/images/icons/map-icon-white.png" /> Mapa </h1>
        <select onChange={e => setTravelMode(e.target.value)}>
          <option value="">All</option>
          <option value="WALK">Walk</option>
          <option value="DRIVE">Drive</option>
          <option value="BICYCLE">Bicycle</option>
        </select>
      </div>
      <div id="map">
        <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true}>
          <MapEvents />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {polygons}
          {polylines}
          {popupInfo && (
            <Popup position={popupInfo.position}>
              Distancia: {popupInfo.data.distanceMeters} m <br />
              Tempo: {popupInfo.data.duration}
            </Popup>
          )}
          {markersElements}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
