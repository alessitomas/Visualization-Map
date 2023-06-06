import React from 'react';
import { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, useMap, TileLayer, Polyline, Popup, Polygon, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline';
import SliderFilters from '../../components/SliderFilters';


const MapPage = () => {
  const [poly, setPoly] = useState([]);
  const [popupInfo, setPopupInfo] = useState(null);
  const [gon, setGon] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState([-23.513860, -46.597593]);
  const [mapZoom, setMapZoom] = useState(15);
  const [macro, setMacro] = useState([]); 
  const [duration, setDuration] = React.useState([0, 5000]);
  const [distance, setDistance] = React.useState([0, 50000]);
  const [travelMode, setTravelMode] = useState(null);
  const mapRef = useRef();

  const minDistance = 10;
  const minDuration = 10;
  const UpdateDuration = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDuration) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDuration);
        setDuration([clamped, clamped + minDuration]);
      } else {
        const clamped = Math.max(newValue[1], minDuration);
        setDuration([clamped - minDuration, clamped]);
      }
    } else {
      setDuration(newValue);
    }
  };
  const UpdateDistance = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setDistance([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setDistance([clamped - minDistance, clamped]);
      }
    } else {
      setDistance(newValue);
    }
  };
  const decodePolyline = (encodedPolyline) => {
    const decodedPolyline = polyline.decode(encodedPolyline);
    return decodedPolyline.map((point) => ({ lat: point[0], lng: point[1] }));
  };


  useEffect(() => {
    const fetchAreaData = async () => {
      try {
        const response = await fetch('http://localhost:5000/areas', { mode: 'cors' });
        const data = await response.json();
        setGon(data.areas);
      } catch (error) {
        console.error('Error fetching areas data:', error);
      }
    };
    fetchAreaData();

  }, []);

  useEffect(() => {
    const fetchMacroData = async () => {
      try {
        const response = await fetch('http://localhost:5000/macro', { mode: 'cors' });
        const data = await response.json();
        setMacro(data.routes);
      } catch (error) {
        console.error('Error fetching macro data:', error);
      }
    };
    fetchMacroData();
  }, []);

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

    fetchPolylineData();

  }, [travelMode]);

  function random(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
    }

  function generateColor(num_seed) {
    return `rgb(${Math.floor(random(num_seed) * 255 )},${Math.floor(random(num_seed+1) * 255)},${Math.floor(random(num_seed-1) * 255)})`;
  }


  const polylines = useMemo(() => poly.map((rota) => {
    const polylineData = decodePolyline(rota.encodedRoutes);

    var curColor = generateColor(rota.id+2);
    var distColor = `rgb(${255-Math.floor(rota.distanceMeters/200)},${0},${0})`; 

    return (
      <Polyline 
        key={rota.id} map
        pathOptions={{ color: distColor }} 
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

  const polylinesMacro = useMemo(() => macro.map((rota) => {
    var curColor = generateColor(rota.people+2);
    const newPos = rota.route.map(coord => [coord[1], coord[0]]);

    return (
      
      <Polyline
        key={rota.name} map
        pathOptions={{ color: curColor }}
        positions={ newPos}
      />
    );
  }), [macro]);



  return (
    <>
    <div id="row">
        <div id="selectors">
            <select onChange={e => setTravelMode(e.target.value)} id="dropdown">
                <option value="">All</option>
                <option value="WALK">Walk</option>
                <option value="DRIVE">Drive</option>
                <option value="BICYCLE">Bicycle</option>
            </select>
            <select id="dropdown"><option value=""> T B D </option></select>
            <div id="slider">
              <SliderFilters duration = {duration} distance={distance}  UpdateDuration={UpdateDuration} UpdateDistance={UpdateDistance} />
            </div>
        </div>
        <div id="centralize">
            <div id="title">
                <h1> <img id="icon-size" src="https://primedepartamentos.com/images/icons/map-icon-white.png" /> Mapa </h1>
            </div>
            <div id="map">
                <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true}>
                
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {polygons}
                {polylines}
                {polylinesMacro}
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
    </div>
    </>
  );
};

export default MapPage;
