import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator";
import L from "leaflet";

// import "./styles.css";
import { useEffect } from "react";

const polyline = [
  [51.505, -0.09],
  [51.51, -0.1],
  [51.51, -0.12]
];

const arrow = [
  {
    offset: "100%",
    repeat: 3,
    symbol: L.Symbol.arrowHead({
      pixelSize: 15,
      polygon: false,
      pathOptions: { stroke: true }
    })
  }
];

function PolylineDecorator({ patterns, polyline }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    L.polyline(polyline).addTo(map);
    L.polylineDecorator(polyline, {
      patterns
    }).addTo(map);
  }, [map]);

  return null;
}

function Map() {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={14}
      style={{ height: "100vh" }}
    >
      <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
      <PolylineDecorator patterns={arrow} polyline={polyline} />
    </MapContainer>
  );
}

export default Map;