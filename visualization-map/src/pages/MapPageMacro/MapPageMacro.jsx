import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { MapContainer, useMap, TileLayer, Polyline, Popup, Polygon, Marker, LayersControl, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline';
import SliderFilters from '../../components/SliderFilters';
import "leaflet-polylinedecorator";
import L, { PolylineDecorator } from "leaflet";


const MapPageMacro = () => {
  const [poly, setPoly] = useState([]);
  const [popupInfo, setPopupInfo] = useState(null);
  const [gon, setGon] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [macro, setMacro] = useState([]); 
  const [duration, setDuration] = React.useState([0, 5000]);
  const [distance, setDistance] = React.useState([0, 50000]);
  const [travelMode, setTravelMode] = useState(null);
  const [colorOption, setColorOption] = useState("curColor");
  var colorSeed = 0;
  var mapZoom = 10;
  var mapCenter = [-23.513860, -46.597593];
  const minDistance = 10;
  const minDuration = 0.5;
  const navigate = useNavigate();

  // FUNCTIONS SECTION -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  function handleClickDiffPage() {
    navigate("/map");
  } 
  
  function PolylineDecorator({ patterns, polyline, choisedColor }) {
    const map = useMap();
  
    useEffect(() => {
      if (!map) return;
  
      L.polyline(polyline, {color:choisedColor}).addTo(map);
      L.polylineDecorator(polyline, {
        patterns
      }).addTo(map);
    }, [map]);
  
    return null;
  }
  
  
  const updateDuration = (event, newValue, activeThumb) => {
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
  
  const updateDistance = (event, newValue, activeThumb) => {
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

  function random(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
    }

    function curColor(seed) {
      return `rgb(${Math.floor(random(seed) * 255 )},${Math.floor(random(seed+1) * 255)},${Math.floor(random(seed-1) * 255)})`; 
    }
  
    function distanceColor(distance) {
      return `rgb(${255-Math.floor(distance/200)},${0},${0})`;
    }
  
    function durationColor(duration) {
      var durationInSeconds = parseInt(duration.slice(0, -1));
      var intensity = Math.min(Math.floor(durationInSeconds / 60), 255); // Ajuste o divisor conforme necessário
      return `rgb(${20},${20},${255-intensity})`; 
    }
  

  // USE EFFECT SECTION  (requests to backend)-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
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
        const durationQueryParam = `duration_min=${duration[0]*3600}&duration_max=${duration[1]*3600}`;
        const distanceQueryParam = `distance_min=${distance[0]}&distance_max=${distance[1]}`;
        const queryParams = [durationQueryParam, distanceQueryParam].join('&');
        const url = `http://localhost:5000/rota?${queryParams}${travelMode ? `&travel_mode=${travelMode}` : ''}`;
        const response = await fetch(url, { mode: 'cors' });
        const data = await response.json();
        setPoly(data.rotas);
        setMarkers(data.rotas);
      } catch (error) {
        console.error('Error fetching polyline data:', error);
      }
    };
  
    fetchPolylineData();
  }, [duration, distance, travelMode]);
  
  // ELEMENTS SECTION -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    const polylines = useMemo(() => poly.map((rota) => {
      const polylineData = decodePolyline(rota.encodedRoutes);
    
      var cColor = curColor(rota.id + 2 + colorSeed);
      var distColor = distanceColor(rota.distanceMeters); 
      var timeColor = durationColor(rota.duration);
    
      let selectedColor;
      switch(colorOption){
        case 'curColor':
          selectedColor = cColor;
          break;
        case 'distColor':
          selectedColor = distColor;
          break;
        case 'timeColor':
          selectedColor = timeColor;
          break;
        default:
          selectedColor = cColor;
      }
    
      return (
        <Polyline 
          key={rota.id} map
          pathOptions={{ color: selectedColor }} 
          positions={polylineData} 
          eventHandlers={{
            click: (e) => {
              setPopupInfo({ position: e.latlng, data: { distanceMeters: rota.distanceMeters, duration: rota.duration } });
            }
          }}
        />
      );
    }), [poly, colorOption]);
    
  

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
    return (
    <Polygon 
    key={area.name} 
    pathOptions={{ color: 'white', opacity:0.5, fillColor:'black', fillOpacity:0.25, weight:2  }} 
    positions={positions} 
    eventHandlers={{
      click: (e) => {
        setPopupInfo({ position: e.latlng, data: { name: area.name } });
      }
    }}/>);
  }), [gon]);

  const polylinesMacro = useMemo(() => macro.map((rota) => {
    var seed = rota.id;
    var curColor = `rgb(${Math.floor(random(seed) * 255 )},${Math.floor(random(seed+1) * 255)},${Math.floor(random(seed-1) * 255)})`;
    const newPos = rota.route.map(coord => [coord[1], coord[0]]);
    const arrow = [
      {
        offset: "10%",
        repeat: "20%",
        symbol: L.Symbol.arrowHead({
        
          pixelSize: 20,
          polygon: false,
          pathOptions: { stroke: true , color: curColor}
        })
      }
    ];
    return (
      
      <PolylineDecorator patterns={arrow} polyline={newPos} choisedColor={curColor} />
    );
  }), [macro]);

// PAGE PRESENTATION SECTION -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  return (
    <>
    <div id="row">
        <div id="selectors">
            <button id="buttonSwitch"
              onClick={handleClickDiffPage}
            >Desativar Macros</button>
            <select onChange={e => setTravelMode(e.target.value)} id="dropdown">
                <option value="">All</option>
                <option value="WALK">Walk</option>
                <option value="DRIVE">Drive</option>
                <option value="BICYCLE">Bicycle</option>
            </select>
            <select onChange={(e) => setColorOption(e.target.value)} id="colorChangeSelect">
              <option value="curColor">Random</option>
              <option value="distColor">By Distance</option>
              <option value="timeColor">By Time</option>
          </select>
            <div id="slider">
              <SliderFilters duration = {duration} distance={distance}  updateDuration={updateDuration} updateDistance={updateDistance} />
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

              <LayersControl position="topright">
                <LayersControl.Overlay checked name="Rotas">
                  <LayerGroup>
                    {polylines}
                    {popupInfo && (
                  <Popup position={popupInfo.position}>
                  Distancia: {popupInfo.data.distanceMeters} m <br />
                  Tempo: {popupInfo.data.duration}
                  </Popup>
              )}
                  </LayerGroup>
                </LayersControl.Overlay>

                <LayersControl.Overlay checked name="Marcadores">
                  <LayerGroup>
                      {markersElements}
                  </LayerGroup>
                </LayersControl.Overlay>

                <LayersControl.Overlay checked name="Áreas">
                  <LayerGroup>
                    {polygons}
                    {/* {popupInfo && (
                    <Popup position={popupInfo.position}>
                    {popupInfo.data.name} <br />
                    </Popup>
                    )} */}
                  </LayerGroup>
                </LayersControl.Overlay>

                <LayersControl.Overlay checked name="Macro Rotas">  
                    <LayerGroup>
                      {polylinesMacro}
                    </LayerGroup>
                </LayersControl.Overlay>


                </LayersControl>
                </MapContainer>
            </div>
        </div>
    </div>
    </>
  );
};

export default MapPageMacro;
