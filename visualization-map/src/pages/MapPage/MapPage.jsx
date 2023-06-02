import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline';
import 'leaflet-kml';
import toGeoJSON from 'togeojson'; // Import the toGeoJSON library
import DOMParser from 'xmldom-alpha';

function decodePolyline(encodedPolyline) {
    const decodedPolyline = polyline.decode(encodedPolyline);
    const points = decodedPolyline.map(point => ({ lat: point[0], lng: point[1] }));
    return points;
}

const Map = () => {

    const center = [-23.513860, -46.597593]

    var encodedPolylineBlue = "po`oCfe{{GfAaDBWkF]_DAoFDb@wBpAkDRgAD}@Ew@UkAmC}HUgA[uCIcB@mAZ{F@eBCs@Da@HIVMhC{C~B_DJ@DKGIIBgC_CCQECrNmRuAwAwBoBcCcCy@s@IMkFwEgFoEgF}EgB_B}CmC}A_BaCyBkA}@q@q@q@_C[a@_@Qe@Cc@FsCx@cC`A_FvBQP_L~DmC~@oARiADaACoAUeA]_A_@mA{@u@o@aAmAoGgKsQmXwCmEeE_HoF_J_@_@cAu@u@U{@OyGWyLw@iFSiMe@cELkBFgBEuBU_BYoGy@gHc@wAWoBk@mAk@kDwBi@UaJkCyE{AqCq@kEuA}AWyAKuA?s@F{AZmAb@cAh@{GpE}A|@gBx@c@Hw@Bq@K{FiDeC}AoQiKaBeAqBcAkCmAuAq@cAYqCWkG[oMq@_A?iA@_BOkGgAoGsAgJmBcCe@oJqBeHs@qAQo@UuB[}DY}BQeI{@_F]{@Eq@KWO[m@Wi@YUwAm@YYS]Ig@Ai@LoJIk@b@eN?{BEmAUgCkAwJMeBCyBFyBVaCRiAh@iBl@_B|@aBpGaJdFeHn@kAr@sBd@iBd@cC^yCJwCAkAYaEk@eEKWUgBMoBAwBHmBXaCX{A`@yAn@eB|@aBp]se@h@_AhAqCf@}ATy@^eCNmBF_CA}AQaDsEkYYoBy@kEqFu\\Gi@_DyRUmCE}A?cA@}ANmDZ_GDgCGgCO{Aw@iEi@aCs@gCiAsC{EoKk@aB_@}Ag@yCQkBK}B?eCH}EDaA@wBImBQkBc@wBm@kBoAmC}@qAkAoAuAiAeAq@{Aq@YKcBe@iBYmBMsBAkAH}P|BwAJiA@{@DwC?yCSuDe@kD{@}Ak@s@[}@i@s@g@u@o@aA_Aa@g@mAiB}@gB}@aCk@wBYiBYkDs@iMa@wESeBg@aCw@iC]_AeAwB_BmC{AqBcBgBgf@ee@{@aAk@s@o@cAaAwBm@mBa@eBYcCOaCEuC[oj@K_CUyB]gBiE}P_Lkc@y@oC}@cCqAwC_AcBoB{CkB_CaAeAqAoAeBuAsCoBsQcL{Au@?QGIsEaDsEyCeIaFwB{AaD{ByGmEa@]_Ag@s@k@uH}EsA}@aBoAm@uAOa@Sw@OaB?c@NaBl@kCZiATwAD{AIoAUkAY{@e@y@i@o@y@m@cAe@w@UwHeAgIaAcH}@uAYyNgB_IiA}Ei@s@AmAHuCn@WNyEvAcB\\eA@kAEoLyA}Hy@cBIyBBiBNiB`@mJlCkIfCsd@fNsBb@_BR{BLaC?sBKai@cGgCSki@sCaBUcBg@sAq@kA{@}@_A{@mA_@w@k@aB]}AeBgJo@iD_D}OSw@UsBq@aPa@wDo@oD~@Sd@dCJTPDTEt@SXAv@Fp@IpCk@RGLIf@i@JIzA_@`Do@NMHOBQDwAUuA";
    const polylineBlue = decodePolyline(encodedPolylineBlue);

    var encodedPolylineRed = "`esnCnki{G`QqCvGeA\\lCyHnALfA}C`BUDYA_@OkAeA{AiBcAoAEKwFz@{@HoD`@WDsAGeCo@y@Y_B}@a@_@Wa@Qg@gByKUaAMM_DyRUmCE}A?cA@}ANmDZ_GDgCGgCO{Aw@iEi@aCs@gCiAsC{EoKk@aB_@}Ag@yCQkBK}B?eCH}EDaA@wBImBQkBc@wBm@kBoAmC}@qAkAoAuAiAeAq@{Aq@YKcBe@iBYmBMsBAkAH}P|BwAJiA@{@DwC?yCSuDe@kD{@}Ak@s@[}@i@s@g@u@o@aA_Aa@g@mAiB}@gB}@aCk@wBYiBYkDs@iMa@wESeBg@aCw@iC]_AeAwB_BmC{AqBcBgBgf@ee@{@aAk@s@o@cAaAwBm@mBa@eBYcCOaCEuC[oj@K_CUyB]gBiE}P_Lkc@y@oC}@cCqAwC_AcBoB{CkB_CaAeAqAoAeBuAsCoBsQcL{Au@?QGIsEaDsEyCeI"
    const polylineRed = decodePolyline(encodedPolylineRed);

    const mapRef = useRef(null);

    useEffect(() => {
      const map = mapRef.current;
      console.log(map);
  
      if (map) {
        // Load the KML file
        fetch('LL_WGS84_KMZ_distrito.kml')
          .then((response) => response.text())
          .then((kml) => {
            const domParser = new DOMParser.DOMParser();
            const xmlDoc = domParser.parseFromString(kml, 'text/xml');
            const geojson = toGeoJSON.kml(xmlDoc); // Convert KML to GeoJSON

            console.log('GeoJSON data:', geojson);
  
            // Add each feature (polygon) to the map
          geojson.features.forEach((feature) => {
            if (feature.geometry.type === 'Polygon') {
              console.log('Polygon coordinates:', feature.geometry.coordinates);
              L.geoJSON(feature).addTo(map);
            }
          });

          map.fitBounds(L.geoJSON(geojson).getBounds());
        });
  
      }
    }, []);

  return (
    <>
          <MapContainer whenCreated={(mapInstance) =>
            {mapRef.current = mapInstance;}} 
                id="map" 
                center={center} 
                zoom={13} 
                scrollWheelZoom={true}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polygon pathOptions={{ fillColor: 'blue', fillOpacity: 0.5 }} positions={[]} /> {/* Placeholder polygon */}
            <Polyline pathOptions={ { color: 'blue' } } positions={ polylineBlue } />
            <Polyline pathOptions={ { color: 'red' } } positions={ polylineRed } />
        </MapContainer>
    </>
  );
}

export default Map;
