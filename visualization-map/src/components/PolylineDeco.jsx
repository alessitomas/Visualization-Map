// PolylineDeco.jsx
import React, { useRef, useEffect } from "react";
import { Polyline, useMap, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet-polylinedecorator";

const PolylineDeco = (props) => {
  const polyRef = useRef();
  const map = useMap();

  // Create a custom SVG icon for the arrow head
  const arrowHead = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="40" height="40"><path d="M600 0 L1200 1200 L600 800 L0 1200 Z" fill="black" /></svg>'),
    iconSize: [30, 30], // size of the icon
    iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
  });

  useEffect(() => {
    if (polyRef.current) { // Make sure the Polyline is rendered
      const polyline = polyRef.current.leafletElement; //get native Leaflet polyline

      // Add the arrow head marker to the last point of the polyline
      const lastPoint = polyline.getLatLngs().pop();
      L.marker(lastPoint, {icon: arrowHead}).addTo(map);
    }
  }, [polyRef.current]); // Add polyRef.current as a dependency

  return <Polyline ref={polyRef} {...props} />;
};

export default PolylineDeco;
