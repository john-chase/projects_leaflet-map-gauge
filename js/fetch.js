/*Init*/
const urls = [
    'https://services2.arcgis.com/C8EMgrsFcRFL6LrL/ArcGIS/rest/services/Okeanos_Explorer_Position/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&f=pgeojson',
    'https://services2.arcgis.com/C8EMgrsFcRFL6LrL/ArcGIS/rest/services/Okeanos_Trackline/FeatureServer/0/query?where=1%3D1&outFields=cruise_id&returnGeometry=true&f=pgeojson',
    'https://services2.arcgis.com/C8EMgrsFcRFL6LrL/ArcGIS/rest/services/Okeanos_Explorer_Position/FeatureServer/0?f=pjson' //Last URL should contain data (json)
];
/* set gauge object */
let gauges = {shipSpeed:0,shipDir:0,windSpd:0,windDir:0,airTemp1:0,airTemp2:0,depthBottom:0,relHumid:0,baroPressure:0,salinity:0,seaTemp1:0,seaTemp2:0}

//set up dom ids
const mapdiv=document.getElementById('mapid')
const statdiv=document.getElementById('statid')
const controller = new AbortController();
const signal = controller.signal;
const gaugesdiv=document.getElementById('gauges')
const gaugesdiv1=document.getElementById('gauges1')
const speedspan=document.getElementById('speed-span')
const coursespan=document.getElementById('course-span')
const windspdspan=document.getElementById('windspd-span')
const winddirspan=document.getElementById('winddir-span')
const relhumspan=document.getElementById('relhum-span')
const barpresspan=document.getElementById('barpres-span')
const depthspan=document.getElementById('depth-span')
const temp1span=document.getElementById('temp1-span')
const temp2span=document.getElementById('temp2-span')
const seatemp1span=document.getElementById('seatemp1-span')
const seatemp2span=document.getElementById('seatemp2-span')
const salinityspan=document.getElementById('salinity-span')
const speedtext=document.getElementById('speed-text')
const coursetext=document.getElementById('course-text')
const windspdtext=document.getElementById('windspd-text')
const winddirtext=document.getElementById('winddir-text')
const relhumtext=document.getElementById('relhum-text')
const barprestext=document.getElementById('barpres-text')
const depthtext=document.getElementById('depth-text')
const temp1text=document.getElementById('temp1-text')
const temp2text=document.getElementById('temp2-text')
const seatemp1text=document.getElementById('seatemp1-text')
const seatemp2text=document.getElementById('seatemp2-text')
const salinitytext=document.getElementById('salinity-text')
//other
const timeElapsed = Date.now();
const today = new Date(timeElapsed);
let cont = true;
try {
    if(!mapdiv||!statdiv||!gaugesdiv||!gaugesdiv1||!speedspan||!coursespan||!windspdspan||!winddirspan||!relhumspan||!barpresspan||!depthspan||!temp1span||!temp2span||!seatemp1span||!seatemp2span||!salinityspan||!speedtext||!coursetext||!windspdtext||!winddirtext||!relhumtext||!barprestext||!depthtext||!temp1text||!temp2text||!seatemp1text||!seatemp2text||!salinitytext) throw new Error("Missing ID elements in HTML file...");
} catch(err) {
    cont = false;
    exitGracefully(err.message);
}
/*Error function*/
function throwErr() {
    mapdiv.classList.remove("mapSize")
    mapdiv.innerHTML = ('<img class="img-responsive" src="images/ex-position-tracks-848x400.jpg" />');
    // !!! unsuccessful attempt at flastmod useage:
    // saveDate='<!--#flastmod file="images/ex-position-tracks-848x400.jpg"-->'
    // console.log(saveDate)
    statdiv.innerHTML='Last Saved Status ('+today.toLocaleDateString()+')';
    gaugesdiv.innerHTML='';
}
/*Fetch function*/
let limit=''
console.log(window.location.search)
//query param switching
if(window.location.search.includes('?')) {
    limit=window.location.search.replace('?', '');//tester: ?1 will abort
    if(limit>1000) {
        statusSwitch=1
    }
} else {
    limit=3000//time after which fetch aborts and pre-saved image is shown
}
setTimeout(() => controller.abort(), limit);
Promise.all(urls.map(url => fetch(url, {signal})))
.then(resp => Promise.all( resp.map(r => r.json()) ))
.then(result => {genMap(result,urls,gauges,cont)})
.catch(err => { //Timed out
    if (err.name === 'AbortError') {
        console.log('Fetch aborted...');
        throwErr();
    } else { //Other error
        console.error('An error has occurred...', err);
        throwErr();
    }
})
/*Map functions*/
function genMap(result,urls,gauges,cont) { if(!cont){return;}
    /*init*/
    // mapid.append('<div id="shipzoom" class="leaflet-control home-zoom" title="Home zoom" alt="Home zoom"><i class="fas fa-home"></i></div>')
    sZ = document.createElement('div');
    sZ.setAttribute("id", "shipzoom");
    sZ.setAttribute("class", "leaflet-control home-zoom");
    sZ.setAttribute("title", "Home zoom");
    sZ.setAttribute("alt", "Home zoom");
    sZ.innerHTML='<i class="fas fa-home"></i>'
    // mapid.append('<div class="leaflet-control full-screen" onclick=shipFullScreen() title="Full screen" alt="Full screen"><i class="fas fa-expand-arrows-alt"></i></div>')
    fS = document.createElement('div');
    fS.setAttribute("id", "fullscreen");
    fS.setAttribute("class", "leaflet-control full-screen");
    fS.setAttribute("onclick", "shipFullScreen()");
    fS.setAttribute("title", "Full screen");
    fS.setAttribute("alt", "Full screen");
    fS.innerHTML='<i class="fas fa-expand-arrows-alt"></i>'
    mapid.append(sZ)
    mapid.append(fS)
    /*iterate the array and assign vars dynamically*/
    urls.forEach(function (url, i) {
        if(url.includes('&f=pgeojson')) {
            window["geojson"+i] = result[i]
            console.log("geojson" +i+" = "+url.split("/services/")[1].split("/")[0].replace(/_/g," "))
            console.log(window["geojson"+i])
        } else {
            window["json"+i] = result[i]
            console.log("json"+i+" = "+url.split("/services/")[1].split("/")[0].replace(/_/g," "))
            console.log(window["json"+i])
        }
    });
    /*init map*/
    var map = L.map('mapid',{zoomSnap: 0});
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
    }).addTo(map);
    /*build popup and status*/
    let pcontent='<h3>Data Points Collected</h3><hr class="popup" /><div>';
    const statdiv=document.getElementById("statid")
    json2.fields.forEach(function(element, i) {
        if(i > 6) { //remove administrative values
            const cnvDateTime = new Date(geojson0.features[0].properties['dateTime']).toLocaleString()
            if(geojson0.features[0].properties[element.name] !== 'NA' && geojson0.features[0].properties[element.name] !== null) {
                switch (element.name) {
                case 'dateTime':
                    pcontent+=element.alias+": <strong>"+cnvDateTime+"</strong><br/>";
                    break;
                case 'IN_PORT':
                    inPort = (geojson0.features[0].properties['IN_PORT'] === "1") ? true : false;
                    if(inPort) {
                        pcontent+='Status: <strong>In Port</strong><br/>'
                        const lng = geojson0.features[0].properties['lon'].toFixed(1)
                        const lat = geojson0.features[0].properties['lat'].toFixed(1)
                        let port = ports.find(port => port.longitude.toFixed(1) === lng && port.latitude.toFixed(1) === lat);
                        if(typeof port === 'undefined'||port === '') {
                            statdiv.innerHTML = 'Current Status: In Port (Docked: '+cnvDateTime+ ')'
                        } else {
                            port=port.portname
                            statdiv.innerHTML = 'Current Status: In Port ('+port+' - Docked: '+cnvDateTime+ ')'
                        }
                    } else {
                        pcontent+='Status: <strong>At Sea</strong><br/>';
                        statdiv.innerHTML = "Current Status: At Sea (" +cnvDateTime+ ")"
                    }
                    break;
                case 'sog':
                    gauges.shipSpeed = geojson0.features[0].properties['sog'].toFixed(1);
                case 'cog':
                    gauges.shipDir = geojson0.features[0].properties['cog'].toFixed(0);
                case 'wind_spd_true_kts':
                    gauges.windSpd = geojson0.features[0].properties['wind_spd_true_kts'].toFixed(1);
                case 'wind_dir_true':
                    gauges.windDir = geojson0.features[0].properties['wind_dir_true'].toFixed(0);
                case 'air_temp':
                    gauges.airTemp1 = ((geojson0.features[0].properties['air_temp'].toFixed(0)*1.8)+32).toFixed(1);
                    gauges.airTemp2 = geojson0.features[0].properties['air_temp'].toFixed(1);
                case 'depth_m':
                    if(geojson0.features[0].properties['depth_m'] !== null && geojson0.features[0].properties['depth_m'] !== 0) {
                        gauges.depthBottom = geojson0.features[0].properties['depth_m'].toFixed(0);
                    } else {
                        gauges.depthBottom = 0;
                    }
                case 'rel_humidity':
                    gauges.relHumid = geojson0.features[0].properties['rel_humidity'].toFixed(0);
                case 'baro_press_mb':
                    gauges.baroPressure = geojson0.features[0].properties['baro_press_mb'].toFixed(0);
                case 'salinity':
                    gauges.salinity = geojson0.features[0].properties['salinity'].toFixed(1);
                case 'sea_surface_temp':
                    gauges.seaTemp1 = ((geojson0.features[0].properties['sea_surface_temp']*1.8)+32).toFixed(1);
                    gauges.seaTemp2 = geojson0.features[0].properties['sea_surface_temp'].toFixed(1);
                default:
                        pcontent+=element.alias+": <strong>"+geojson0.features[0].properties[element.name]+"</strong><br/>";
                }
            }
        }
    });
    pcontent+='</div>'
    /*build icons*/
    if(inPort) {
        // console.log('IN PORT')
        var shipIcon = L.icon({
            iconUrl: 'icons/ex-icon-docked-250x250.png',
            iconSize:     [32, 32], // size of the icon
            iconAnchor:   [16, 15], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, -11] // point from which the popup should open relative to the iconAnchor
        });
    } else {
        // console.log('AT SEA')
        var shipIcon = L.icon({
            iconUrl: 'icons/ex-icon-in-transit-250x250.png',
            iconSize:     [32, 32], // size of the icon
            iconAnchor:   [16, 15], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, -11] // point from which the popup should open relative to the iconAnchor
        });
        /*add features*/
        var compassIcon = L.icon({
            iconUrl: 'icons/compass.png',
            iconSize:     [46, 46], // size of the icon
            iconAnchor:   [23, 23], // point of the icon which will correspond to marker's location
        });
        if(geojson0.features[0].properties['cog'] !== null) {
            var direction = Number(geojson0.features[0].properties['cog'].toFixed(0));
        } else {
            var direction = 0;
        }
        var addedCompass = L.geoJSON(geojson0, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: compassIcon, rotationAngle:direction});//direction - replace with a 0-359 value to test
            }
        }).addTo(map);
    }
    /*add features*/
    var addedShip = L.geoJSON(geojson0, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: shipIcon}).bindPopup(pcontent);
        }
    }).addTo(map);    
    const mapDiv = document.getElementById("mapid");
    if(!inPort) { 
        var addedTracks = L.geoJSON(geojson1, {
            style : function(feature) {
                return {
                    color: '#0099D8', //0a4595
                    weight: 1.25,
                    dashArray: '3'
                }
            },
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng);
            }
        }).addTo(map);   
        resize(map, mapDiv, addedShip, addedTracks)                   
    } else {
        resize(map, mapDiv, addedShip)             
    }    
    /*zoom to layer - home view*/
    shipzoom.addEventListener('click',(e) => onHomeZoom(map, addedShip, addedTracks, e));
    drawGauges(gauges)
}
/*Resize Observer*/
function resize(map, mapDiv, addedShip, addedTracks) {
    /*fit extents to features*/
    if (!inPort) { 
        map.fitBounds(addedShip.getBounds().pad(.2).extend(addedTracks.getBounds().pad(.2)));  
    } else {    
        map.fitBounds(addedShip.getBounds().pad(.2));
        map.setZoom(10);
    }
    //resize inside flex container
    const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
        /*set extents to features with padding */
        if (!inPort) {         
            map.fitBounds(addedShip.getBounds().pad(.2).extend(addedTracks.getBounds().pad(.2)));  
        } else {
            map.fitBounds(addedShip.getBounds().pad(.2));
            map.setZoom(10);
        }
    });    
    resizeObserver.observe(mapDiv);  
}
/*restore home zoom*/
function onHomeZoom(map, addedShip, addedTracks, e) {    
    console.log(map, addedShip, addedTracks, e)
    if (!inPort) {         
        map.fitBounds(addedShip.getBounds().pad(.2).extend(addedTracks.getBounds().pad(.2)));  
    } else {
        map.fitBounds(addedShip.getBounds().pad(.2));
        map.setZoom(10);
    }    
}
//enable full screen toggle
function shipFullScreen() {
    const mapElem = document.getElementById('mapid');
    if(document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        mapElem.requestFullscreen()
    }
}
function drawGauges(gauges) {
    //SPEED OVER GROUND
    var gauge1 =  new RadialGauge({
        renderTo: 'speed-id',
        width: 160,
        height: 160,
        minValue: 0,
        maxValue: 12,
        majorTicks: ['0','1','2','3','4','5','6','7','8','9','10','11','12'],
        minorTicks: 10,
        strokeTicks: true,
        highlights: [
            {from: 10, to: 12, color: 'rgba(200, 50, 50, .75)'}
        ],
        valueBox: false,
        colorUnits: '#333',
        fontUnitsSize: '30',
        needleCircleOuter: true,
        needleCircleInner: false,
        colorNeedleCircleOuter: '#333',
        colorNeedleCircleInner: '#444',
        animateOnInit: true,
        animationRule: 'quint', //elastic quad quint cycle bounce delastic dequad dequint decycle debounce
        animationTarget: 'needle',
        animationDuration: 2000,
        value: gauges.shipSpeed
    }).draw();
    speedspan.innerHTML=gauges.shipSpeed+" (knots)"
    speedspan.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    speedtext.innerHTML=gauges.shipSpeed+" (knots)"
    speedtext.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    //COURSE OVER GROUND
    var gauge2 = new RadialGauge({
        renderTo: 'course-id',
        width: 160,
        height: 160,
        minValue: 0,
        maxValue: 360,
        majorTicks: ['N','NE','E','SE','S','SW','W','NW','N'],
        minorTicks: 22,
        ticksAngle: 360,
        startAngle: 180,
        strokeTicks: true,
        highlights: false,
        colorPlate: '#0099D8',
        colorMajorTicks: '#fff',
        colorMinorTicks: '#eee',
        needleCircleOuter: true,
        needleCircleInner: false,
        colorNeedleCircleOuter: '#333',
        colorNeedleCircleInner: '#444',
        colorNumbers: '#fff',
        animateOnInit: true,
        animationRule: 'quint',
        animationTarget: 'needle',
        animationDuration: 2000,
        valueBox: false,
        value: gauges.shipDir
    }).draw();
    coursespan.innerHTML=gauges.shipDir+"° ("+degToCompass(gauges.shipDir)+")"
    coursespan.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    coursetext.innerHTML=gauges.shipDir+"° ("+degToCompass(gauges.shipDir)+")"
    coursetext.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    //WIND SPEED
    var gauge3 =  new RadialGauge({
        renderTo: 'wind-spd-id',
        width: 160,
        height: 160,
        colorUnits: '#333',
        fontUnitsSize: 30,
        minValue: 0,
        maxValue: 72,
        majorTicks: ['0','10','20','30','40','50','60','70','80'],
        minorTicks: 10,
        strokeTicks: true,
        highlights: [
            {from: 0, to: 1, color: 'rgba(255, 255, 255, 1)'},
            {from: 1, to: 3, color: 'rgba(174, 241, 249, 1)'},
            {from: 3, to: 6, color: 'rgba(150, 247, 220, 1)'},
            {from: 6, to: 10, color: 'rgba(150, 247, 180, 1)'},
            {from: 10, to: 16, color: 'rgba(111, 244, 111, 1)'},
            {from: 16, to: 21, color: 'rgba(115, 237, 18, 1)'},
            {from: 21, to: 27, color: 'rgba(164, 237, 18, 1)'},
            {from: 27, to: 33, color: 'rgba(218, 237, 18, 1)'},
            {from: 33, to: 40, color: 'rgba(237, 194, 18, 1)'},
            {from: 40, to: 47, color: 'rgba(237, 143, 18, 1)'},
            {from: 47, to: 55, color: 'rgba(237, 99, 18, 1)'},
            {from: 55, to: 63, color: 'rgba(237, 41, 18, 1)'},
            {from: 63, to: 72, color: 'rgba(213, 16, 45, 1)'}
        ],
        valueBox: false,
        needleCircleOuter: true,
        needleCircleInner: false,
        colorNeedleCircleOuter: '#333',
        colorNeedleCircleInner: '#444',
        animateOnInit: true,
        animationRule: 'quint',
        animationTarget: 'needle',
        animationDuration: 2000,
        value: gauges.windSpd
    }).draw();
    windspdspan.innerHTML=gauges.windSpd+" (knots)"
    windspdspan.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    windspdtext.innerHTML=gauges.windSpd+" (knots)"
    windspdtext.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    //WIND DIRECTION
    var gauge4 =  new RadialGauge({
        renderTo: 'wind-dir-id',
        width: 160,
        height: 160,
        minValue: 0,
        maxValue: 360,
        ticksAngle: 360,
        startAngle: 180,
        majorTicks: ['N','NE','E','SE','S','SW','W','NW','N'],
        minorTicks: 22,
        highlights: false,
        colorPlate: '#0a4595',
        colorMajorTicks: '#fff',
        colorMinorTicks: '#eee',
        colorNumbers: '#fff',
        fontTitleSize: 30,
        valueBox: false,
        needleCircleOuter: true,
        needleCircleInner: false,
        colorNeedleCircleOuter: '#333',
        colorNeedleCircleInner: '#444',
        animateOnInit: true,
        animationRule: 'quint',
        animationTarget: 'needle',
        animationDuration: 2000,
        value: gauges.windDir
    }).draw();
    winddirspan.innerHTML=gauges.windDir+"° ("+degToCompass(gauges.windDir)+")"
    winddirspan.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    winddirtext.innerHTML=gauges.windDir+"° ("+degToCompass(gauges.windDir)+")"
    winddirtext.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    //RELATIVE HUMIDITY
    var gauge5 =  new RadialGauge({
        renderTo: 'rel-hum-id',
        width: 160,
        height: 160,
        colorUnits: '#333',
        fontUnitsSize: 30,
        valueBox: false,
        fontNumbersSize: 20,
        colorUnits: '#333',
        fontUnitsSize: 30,
        minValue: 0,
        maxValue: 100,
        majorTicks: ['0','10','20','30','40','50','60','70','80','90','100'],
        minorTicks: 10,
        strokeTicks: true,
        minorTicks: 10,
        highlights: true,
        highlights: [
            {from: 0, to: 30, color: 'rgba(255,0,0,.5)'},
            {from: 30, to: 60, color: 'rgba(0,235,87,.7)'},
            {from: 60, to: 65, color: 'rgba(162,255,0,.7)'},
            {from: 65, to: 100, color: 'rgba(15,177,255,.5)'},
        ],
        valueBox: false,
        needleCircleOuter: true,
        needleCircleInner: false,
        colorNeedleCircleOuter: '#333',
        colorNeedleCircleInner: '#444',
        animateOnInit: true,
        animationRule: 'quint',
        animationTarget: 'needle',
        animationDuration: 2000,
        value: gauges['relHumid']
    }).draw();
    relhumspan.innerHTML=gauges.relHumid+"%"
    relhumspan.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    relhumtext.innerHTML=gauges.relHumid+"%"
    relhumtext.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    //BAROMETRIC PRESSURE
    var gauge6 =  new RadialGauge({
        renderTo: 'bar-pressure-id',
        width: 160,
        height: 160,
        colorUnits: '#333',
        fontUnitsSize: 30,
        valueBox: false,
        fontNumbersSize: 20,
        colorBarProgress: 'rgba(50,50,200,.75)',
        colorBar: '#aae',
        colorUnits: '#333',
        fontUnitsSize: 30,
        minValue: 957,
        maxValue: 1063,
        majorTicks: ['960','970','980','990','1000','1010','1020','1030','1040','1050','1060'],
        minorTicks: 10,
        strokeTicks: true,
        minorTicks: 10,
        highlights: true,
        highlights: [
            {from: 957, to: 960, color: 'rgba(255,255,255,1)'},
            {from: 960, to: 1015, color: 'rgba(98,98,98,.4)'},
            {from: 1015, to: 1060, color: 'rgba(255,255,0,1)'},
            {from: 1060, to: 1063, color: 'rgba(255,255,255,1)'},
        ],
        valueBox: false,
        needleCircleOuter: true,
        needleCircleInner: false,
        colorNeedleCircleOuter: '#333',
        colorNeedleCircleInner: '#444',
        animateOnInit: true,
        animationRule: 'quint',
        animationTarget: 'needle',
        animationDuration: 2000,
        value: gauges['baroPressure']
    }).draw();
    barpresspan.innerHTML=gauges.baroPressure+" (mb)"
    barpresspan.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    barprestext.innerHTML=gauges.baroPressure+" (mb)"
    barprestext.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    //DEPTH TO BOTTOM
    var gauge7 =  new LinearGauge({
        renderTo: 'depth-id',
        width: 160,
        height: 160,
        valueBox: false,
        barBeginCircle: false,
        fontNumbersSize: 14,
        maxValue: 11000,
        majorTicks: ['11000','10000','9000','8000','7000','6000','5000','4000','3000','2000','1000','0'],
        minorTicks: '2',
        strokeTicks: true,
        highlights: [
            {from: 0, to: 1000, color: 'rgba(0,0,139,1)'},
            {from: 1000, to: 2000, color: 'rgba(0,0,139,.9)'},
            {from: 2000, to: 3000, color: 'rgba(0,0,139,.8)'},
            {from: 3000, to: 4000, color: 'rgba(0,0,139,.7)'},
            {from: 4000, to: 5000, color: 'rgba(0,0,139,.6)'},
            {from: 5000, to: 6000, color: 'rgba(0,0,139,.5)'},
            {from: 6000, to: 7000, color: 'rgba(0,0,139,.4)'},
            {from: 7000, to: 8000, color: 'rgba(0,0,139,.3)'},
            {from: 8000, to: 9000, color: 'rgba(0,0,139,.2)'},
            {from: 9000, to: 10000, color: 'rgba(0,0,139,.1)'},
            {from: 10000, to: 11000, color: 'rgba(0,0,139,0)'}
        ],
        ticksWidth:12,
        tickSide: 'left',
        numberSide: 'left',
        needleSize: 10,
        needleSide: 'left',
        needleType: 'arrow',
        colorNeedleEnd: '#f00',
        needleWidth: 6,
        needleCircleSize: 8,
        borders: false,
        borderShadowWidth: 0,
        barWidth: 0,
        colorNumbers: '#000',
        colorPlate: '#efefef',
        animateOnInit: true,
        animationRule: 'quint',
        animationTarget: 'needle',
        animationDuration: 2000,
        value: gauges.depthBottom === 0?11000:Math.abs(gauges.depthBottom-11000) //because it likes bottom up scales so 11000 = 0
    }).draw();
    if(gauges.depthBottom === 0) {
        depthspan.innerHTML="OFF"
        depthspan.setAttribute("style", "color:red;font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
        depthtext.innerHTML="OFF"
        depthtext.setAttribute("style", "color:red;font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    } else {
        depthspan.innerHTML=gauges.depthBottom+" (meters)"
        depthspan.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
        depthtext.innerHTML=gauges.depthBottom+" (meters)"
        depthtext.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    }
    //AIR TEMPERATURE
    var gauge8 =  new RadialGauge({
        renderTo: 'temp-id',
        width: 160,
        height: 160,
        fontUnitsSize: 30,
        minValue: -60,
        maxValue: 120,
        majorTicks: ['-60','-50','-40','-30','-20','-10','0','10','20','30','40','50','60','70','80','90','100','110','120'],
        minorTicks: '2',
        strokeTicks: true,
        highlights: [
            {from: -60, to: -50, color: 'rgba(0,0,255,1)'},
            {from: -50, to: -40, color: 'rgba(0,0,255,.9)'},
            {from: -40, to: -30, color: 'rgba(0,0,255,.8)'},
            {from: -30, to: -20, color: 'rgba(0,0,255,.7)'},
            {from: -20, to: -10, color: 'rgba(0,0,255,.5)'},
            {from: -10, to: 0, color: 'rgba(0,0,255,.3)'},
            {from: 0, to: 20, color: 'rgba(0,0,255,.2)'},
            {from: 20, to: 30, color: 'rgba(0,0,255,.1)'},
            {from: 30, to: 40, color: 'rgba(0,0,255,.05)'},
            {from: 40, to: 50, color: 'rgba(0,0,0,0)'},
            {from: 50, to: 60, color: 'rgba(255,0,0,.1)'},
            {from: 60, to: 70, color: 'rgba(255,0,0,.2)'},
            {from: 70, to: 80, color: 'rgba(255,0,0,.4)'},
            {from: 80, to: 90, color: 'rgba(255,0,0,.6)'},
            {from: 90, to: 100, color: 'rgba(255,0,0,.8)'},
            {from: 100, to: 110, color: 'rgba(255,0,0,.9)'},
            {from: 110, to: 120, color: 'rgba(255,0,0,1)'}
        ],
        valueBox: false,
        colorMajorTicks: '#333',
        colorMinorTicks: '#333',
        colorUnits: '#333',
        colorNumbers: '#333',
        colorPlate: '#fff',
        borderShadowWidth: 0,
        borders: true,
        needleCircleOuter: true,
        needleCircleInner: false,
        colorNeedleCircleOuter: '#333',
        colorNeedleCircleInner: '#444',
        animateOnInit: true,
        animationRule: 'quint',
        animationTarget: 'needle',
        animationDuration: 2000,
        value: gauges['airTemp1']
    }).draw();
    temp1span.innerHTML=gauges.airTemp1+" (°F)"
    temp1span.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    temp1text.innerHTML=gauges.airTemp1+" (°F)"
    temp1text.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    //AIR TEMPERATURE 2
    var gauge9 =  new LinearGauge({
        renderTo: 'temp2-id',
        width: 160,
        height: 160,
        fontUnitsSize: 16,
        colorUnits: '#000',
        fontNumbersSize: 14,
        minValue: -50,
        maxValue: 50,
        majorTicks: ['-50','-40','-30','-20','-10','0','10','20','30','40','50'],
        minorTicks: 2,
        strokeTicks: true,
        highlights: [
            {from: -50, to: -40, color: 'rgba(0,0,255,1)'},
            {from: -40, to: -30, color: 'rgba(0,0,255,.8)'},
            {from: -30, to: -20, color: 'rgba(0,0,255,.6)'},
            {from: -20, to: -10, color: 'rgba(0,0,255,.4)'},
            {from: -10, to: 0, color: 'rgba(0,0,255,.2)'},
            {from: 0, to: 20, color: 'rgba(0,0,0,0)'},
            {from: 20, to: 30, color: 'rgba(255,0,0,.3)'},
            {from: 30, to: 40, color: 'rgba(255,0,0,.6)'},
            {from: 40, to: 50, color: 'rgba(255,0,0,1)'}
        ],
        tickSide: 'left',
        numberSide: 'left',
        needleSize: 10,
        needleSide: 'left',
        valueBox: false,
        colorPlate: '#efefef',
        borderShadowWidth: 0,
        borders: false,
        barBeginCircle: false,
        barStrokeWidth: 1,
        colorBarStroke: '#000',
        barWidth: 5,
        barBeginCircle: 7,
        colorNumbers: '#000',
        colorBarProgress: '#f00',
        colorNeedleEnd: '#f00',
        needleWidth: 6,
        animateOnInit: true,
        animationRule: 'quint',
        animationTarget: 'needle',
        animationDuration: 2000,
        value: gauges['airTemp2']
    }).draw();
    temp2span.innerHTML=gauges.airTemp2+" (°C)"
    temp2span.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    temp2text.innerHTML=gauges.airTemp2+" (°C)"
    temp2text.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    //SEA SURFACE TEMPERATURE 1
    var gauge10 =  new RadialGauge({
        renderTo: 'sea-temp1-id',
        width: 160,
        height: 160,
        // units: '(°F)',
        fontUnitsSize: 30,
        minValue: -60,
        maxValue: 120,
        majorTicks: ['-60','-50','-40','-30','-20','-10','0','10','20','30','40','50','60','70','80','90','100','110','120'],
        minorTicks: '2',
        strokeTicks: true,
        highlights: [
            {from: -60, to: -50, color: 'rgba(0,153,216,1)'},
            {from: -50, to: -40, color: 'rgba(0,153,216,.9)'},
            {from: -40, to: -30, color: 'rgba(0,153,216,.8)'},
            {from: -30, to: -20, color: 'rgba(0,153,216,.7)'},
            {from: -20, to: -10, color: 'rgba(0,153,216,.5)'},
            {from: -10, to: 0, color: 'rgba(0,153,216,.3)'},
            {from: 0, to: 20, color: 'rgba(0,153,216,.2)'},
            {from: 20, to: 30, color: 'rgba(0,153,216,.1)'},
            {from: 30, to: 40, color: 'rgba(0,153,216,.05)'},
            {from: 40, to: 50, color: 'rgba(0,0,0,0)'},
            {from: 50, to: 60, color: 'rgba(255,18,66,.1)'},
            {from: 60, to: 70, color: 'rgba(255,18,66,.2)'},
            {from: 70, to: 80, color: 'rgba(255,18,66,.4)'},
            {from: 80, to: 90, color: 'rgba(255,18,66,.6)'},
            {from: 90, to: 100, color: 'rgba(255,18,66,.8)'},
            {from: 100, to: 110, color: 'rgba(255,18,66,.9)'},
            {from: 110, to: 120, color: 'rgba(255,18,66,1)'}
        ],
        valueBox: false,
        colorMajorTicks: '#333',
        colorMinorTicks: '#333',
        colorUnits: '#333',
        colorNumbers: '#000',
        colorPlate: '#fff',
        borderShadowWidth: 0,
        borders: true,
        needleCircleOuter: true,
        needleCircleInner: false,
        colorNeedleCircleOuter: '#333',
        colorNeedleCircleInner: '#444',
        animateOnInit: true,
        animationRule: 'quint',
        animationTarget: 'needle',
        animationDuration: 2000,
        value: gauges['seaTemp1']
    }).draw();
    seatemp1span.innerHTML=gauges.seaTemp1+" (°F)"
    seatemp1span.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    seatemp1text.innerHTML=gauges.seaTemp1+" (°F)"
    seatemp1text.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    //SEA SURFACE TEMPERATURE 2
    var gauge11 =  new LinearGauge({
        renderTo: 'sea-temp2-id',
        width: 160,
        height: 160,
        // units: '(°C)',
        fontUnitsSize: 16,
        colorUnits: '#000',
        fontNumbersSize: 14,
        minValue: -50,
        maxValue: 50,
        majorTicks: ['-50','-40','-30','-20','-10','0','10','20','30','40','50'],
        minorTicks: 2,
        strokeTicks: true,
        highlights: [
            {from: -50, to: -40, color: 'rgba(0,153,216,1)'},
            {from: -40, to: -30, color: 'rgba(0,153,216,.8)'},
            {from: -30, to: -20, color: 'rgba(0,153,216,.6)'},
            {from: -20, to: -10, color: 'rgba(0,153,216,.4)'},
            {from: -10, to: 0, color: 'rgba(0,153,216,.2)'},
            {from: 0, to: 20, color: 'rgba(0,0,0,0)'},
            {from: 20, to: 30, color: 'rgba(255,18,66,.3)'},
            {from: 30, to: 40, color: 'rgba(255,18,66,.6)'},
            {from: 40, to: 50, color: 'rgba(255,18,66,1)'}
        ],
        tickSide: 'left',
        numberSide: 'left',
        needleSize: 10,
        needleSide: 'left',
        valueBox: false,
        colorPlate: '#efefef',
        borderShadowWidth: 0,
        borders: false,
        barBeginCircle: false,
        barStrokeWidth: 1,
        colorBarStroke: '#000',
        barWidth: 5,
        barBeginCircle: 7,
        colorNumbers: '#000',
        colorBarProgress: '#f00',
        colorNeedleEnd: '#f00',
        needleWidth: 6,
        animateOnInit: true,
        animationRule: 'quint',
        animationTarget: 'needle',
        animationDuration: 2000,
        value: gauges['seaTemp2']
    }).draw();
    seatemp2span.innerHTML=gauges.seaTemp2+" (°C)"
    seatemp2span.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    seatemp2text.innerHTML=gauges.seaTemp2+" (°C)"
    seatemp2text.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    //SALINITY
    var gauge12 =  new RadialGauge({
        renderTo: 'salinity-id',
        width: 160,
        height: 160,
        // units: '(g/L)',
        colorUnits: '#333',
        fontUnitsSize: 30,
        minValue: 30,
        maxValue: 40,
        majorTicks: ['30','31','32','33','34','35','36','37','38','39','40'],
        minorTicks: 10,
        strokeTicks: true,
        highlights: [
            {from: 30, to: 31, color: 'rgba(255,165,0,0)'},
            {from: 31, to: 32, color: 'rgba(255,165,0,.1)'},
            {from: 32, to: 33, color: 'rgba(255,165,0,.2)'},
            {from: 33, to: 34, color: 'rgba(255,165,0,.3)'},
            {from: 34, to: 35, color: 'rgba(255,165,0,.4)'},
            {from: 35, to: 36, color: 'rgba(255,165,0,.5)'},
            {from: 36, to: 37, color: 'rgba(255,165,0,.6)'},
            {from: 37, to: 38, color: 'rgba(255,165,0,.7)'},
            {from: 38, to: 39, color: 'rgba(255,165,0,.8)'},
            {from: 39, to: 40, color: 'rgba(255,165,0,.9)'},
        ],
        valueBox: false,
        needleCircleOuter: true,
        needleCircleInner: false,
        colorNeedleCircleOuter: '#333',
        colorNeedleCircleInner: '#444',
        animateOnInit: true,
        animationRule: 'quint',
        animationTarget: 'needle',
        animationDuration: 2000,
        value: gauges['salinity']
    }).draw();
    salinityspan.innerHTML=gauges.salinity+" (g/L)"
    salinityspan.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
    salinitytext.innerHTML=gauges.salinity+" (g/L)"
    salinitytext.setAttribute("style", "font-weight:bold;border:1px solid #0099D8;background-color:#fff;padding:2px;margin-top:2px;border-radius:2px");
}
function exitGracefully(msg) {
    if(mapdiv) {mapdiv.innerHTML = '<img class="img-responsive" src="images/ex-position-tracks-848x400.jpg" />';}
    if(gaugesdiv) {gaugesdiv.innerHTML = ''}
    if(statdiv) {statdiv.innerHTML = 'Last Known Status ('+today.toLocaleDateString()+')';}
    console.log(msg);
}
function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}
