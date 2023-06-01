import React from "react";

const MapPage = () => {

    const map = L.map('map').setView([-23.513860, -46.597593], 13);

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    var encodedPolyline = "po`oCfe{{GfAaDBWkF]DAoFDb@wBpAkDRgAD}@Ew@UkAmC}HUgA[uCIcB@mAZ{F@eBCs@Da@HIVMhC{C~B_DJ@DKGIIBgC_CCQECrNmRuAwAwBoBcCcCy@s@IMkFwEgFoEgF}EgB_B}CmC}A_BaCyBkA}@q@q@q@_C[a@@Qe@Cc@FsCx@cC`A_FvBQP_L~DmC~@oARiADaACoAUeA]A@mA{@u@o@aAmAoGgKsQmXwCmEeE_HoF_J_@@cAu@u@U{@OyGWyLw@iFSiMe@cELkBFgBEuBU_BYoGy@gHc@wAWoBk@mAk@kDwBi@UaJkCyE{AqCq@kEuA}AWyAKuA?s@F{AZmAb@cAh@{GpE}A|@gBx@c@Hw@Bq@K{FiDeC}AoQiKaBeAqBcAkCmAuAq@cAYqCWkG[oMq@_A?iA@_BOkGgAoGsAgJmBcCe@oJqBeHs@qAQo@UuB[}DY}BQeI{@_F]{@Eq@KWO[m@Wi@YUwAm@YYS]Ig@Ai@LoJIk@b@eN?{BEmAUgCkAwJMeBCyBFyBVaCRiAh@iBl@_B|@aBpGaJdFeHn@kAr@sBd@iBd@cC^yCJwCAkAYaEk@eEKWUgBMoBAwBHmBXaCX{A`@yAn@eB|@aBp]se@h@_AhAqCf@}ATy@^eCNmBF_CA}AQaDsEkYYoBy@kEqFu\\Gi@_DyRUmCE}A?cA@}ANmDZ_GDgCGgCO{Aw@iEi@aCs@gCiAsC{EoKk@aB@}Ag@yCQkBK}B?eCH}EDaA@wBImBQkBc@wBm@kBoAmC}@qAkAoAuAiAeAq@{Aq@YKcBe@iBYmBMsBAkAH}P|BwAJiA@{@DwC?yCSuDe@kD{@}Ak@s@[}@i@s@g@u@o@aA_Aa@g@mAiB}@gB}@aCk@wBYiBYkDs@iMa@wESeBg@aCw@iC]AeAwB_BmC{AqBcBgBgf@ee@{@aAk@s@o@cAaAwBm@mBa@eBYcCOaCEuC[oj@K_CUyB]gBiE}P_Lkc@y@oC}@cCqAwC_AcBoB{CkB_CaAeAqAoAeBuAsCoBsQcL{Au@?QGIsEaDsEyCeIaFwB{AaD{ByGmEa@]_Ag@s@k@uH}EsA}@aBoAm@uAOa@Sw@OaB?c@NaBl@kCZiATwAD{AIoAUkAY{@e@y@i@o@y@m@cAe@w@UwHeAgIaAcH}@uAYyNgB_IiA}Ei@s@AmAHuCn@WNyEvAcB\\eA@kAEoLyA}Hy@cBIyBBiBNiB`@mJlCkIfCsd@fNsBb@_BR{BLaC?sBKai@cGgCSki@sCaBUcBg@sAq@kA{@}@_A{@mA@w@k@aB]}AeBgJo@iD_D}OSw@UsBq@aPa@wDo@oD~@Sd@dCJTPDTEt@SXAv@Fp@IpCk@RGLIf@i@JIzA_@`Do@NMHOBQDwAUuA";

    // decode the polyline using the Polyline library
    var latLngs = polyline.decode(encodedPolyline);

    // create a polyline using the decoded lat/lngs and add it to the map
    var polyline = L.polyline(latLngs, {color: 'red'}).addTo(map).bindPopup('A pretty CSS3 popup.<br> Easily customizable.');

    // fit the map to the bounds of the polyline
    map.fitBounds(polyline.getBounds());
    
    return (
        <>
            <head>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
                <script src="https://unpkg.com/polyline"></script>
            </head>

            <body>
                <h1>Map Page</h1>

                <div id="map" style="width: 600px; height: 400px;"></div>
            </body>
            
        </>
    )
};


export default MapPage