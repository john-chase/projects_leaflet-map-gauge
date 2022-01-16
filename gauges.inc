<div id="gauges" class="ph0">
    <h3 id="instrumentation">Meteorological/Navigational Data Displays</h3>
    <p>The gauges below represent data being collected from sensors on NOAA Ship <em>Okeanos Explorer</em> - reflecting conditions at the sea surface, not at the depth of the remotely operated vehicle (if deployed). Click on a parameter name to learn more about what the gauge is displaying.</p>
    <div class="theme-tabs">
        <ul>
            <li class="gtab active" id="gaugestab"><a href="#">Gauges</a></li>
            <!-- <li class="gtab" id="graphictab"><a href="#">Infographic</a></li> -->
            <li class="gtab" id="texttab"><a href="#">Textual Listing</a></li>
        </ul>
    </div>
    <div id="gauges1" class="row mt3 ph0 gaugeBox">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-1 ph0 text-center smaller">
            <canvas id="speed-id"></canvas>
            <h6 class="center"><span id="speed" tabindex="0">Speed Over Ground</span></h6>
            <p><span id="speed-span"></span></p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-1 ph0 text-center smaller">
            <canvas id="course-id"></canvas>
            <h6 class="center"><span id="course">Course Over Ground</span></h6>
            <p><span id="course-span"></span></p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-1 ph0 text-center smaller">
            <canvas id="wind-spd-id"></canvas>
            <h6 class="center"><span id="wind-spd">Wind Speed</span></h6>
            <p><span id="windspd-span"></span></p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-1 ph0 text-center smaller">
            <canvas id="wind-dir-id"></canvas>
            <h6 class="center"><span id="wind-dir">Wind Direction</span></h6>
            <p><span id="winddir-span"></span></p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-1 ph0 text-center smaller" >
            <canvas id="rel-hum-id"></canvas>
            <h6 class="center"><span id="rel-hum">Relative Humidity</span></h6>
            <p><span id="relhum-span"></span></p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-1 ph0 text-center smaller">
            <canvas id="bar-pressure-id"></canvas>
            <h6 class="center"><span id="bar-pressure">Barometric Pressure</span></h6>
            <p><span id="barpres-span"></span></p>
        </div>
    </div>
    <div id="gauges2" class="row mt3 gaugeBox">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-1 ph0 text-center smaller">
            <canvas id="depth-id"></canvas>
            <h6 class="center"><span id="depth">*Depth to Ocean Floor<strong></strong></span></h6>
            <p><span id="depth-span"></span></p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-1 ph0 text-center smaller">
            <canvas id="temp-id"></canvas>
            <h6 class="center"><span id="temp1">Air Temperature 1</span></h6>
            <p><span id="temp1-span"></span></p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-1 ph0 text-center smaller">
            <canvas id="temp2-id"></canvas>
            <h6 class="center"><span id="temp2">Air Temperature 2</span></h6>
            <p><span id="temp2-span"></span></p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-1 ph0 text-center smaller">
            <canvas id="sea-temp1-id"></canvas>
            <h6 class="center"><span id="seatemp1">Sea Surface Temperature 1</span></h6>
            <p><span id="seatemp1-span"></span></p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-1 ph0 text-center smaller">
            <canvas id="sea-temp2-id"></canvas>
            <h6 class="center"><span id="seatemp2">Sea Surface Temperature 2</span></h6>
            <p><span id="seatemp2-span"></span></p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-1 ph0 text-center smaller">
            <canvas id="salinity-id"></canvas>
            <h6 class="center"><span id="salinity">Salinity</span></h6>
            <p><span id="salinity-span"></span></p>
        </div>
    </div>
    <!-- <div id="graphic" class="row mt3 hidden gaugeBox review">Comment this out until graphic received!</div> -->
    <div id="text" class="row mt3 hidden gaugeBox">
        <!-- <p class="review">All data points collected. Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro iure voluptate deleniti est tempore eligendi, molestias sequi excepturi ab qui praesentium numquam nobis labore a sed mollitia, dolor voluptatem vero!</p> -->
        <div class="col-xs-12 col-sm-6">
            <p><strong>Speed Over Ground</strong>: <span id="speed-text"></span></p>
            <p><strong>Course Over Ground</strong>: <span id="course-text"></span></p>
            <p><strong>Wind Speed</strong>: <span id="windspd-text"></span></p>
            <p><strong>Wind Direction</strong>: <span id="winddir-text"></span></p>
            <p><strong>Relative Humidity</strong>: <span id="relhum-text"></span></p>
            <p><strong>Barometric Pressure</strong>: <span id="barpres-text"></span></p>
        </div>
        <div class="col-xs-12 col-sm-6">
            <p><strong>*Depth to Ocean Floor</strong>: <span id="depth-text"></span></p>
            <p><strong>Air Temperature 1</strong>: <span id="temp1-text"></span></p>
            <p><strong>Air Temperature 2</strong>: <span id="temp2-text"></span></p>
            <p><strong>Sea Surface Temperature 1</strong>: <span id="seatemp1-text"></span></p>
            <p><strong>Sea Surface Temperature 2</strong>: <span id="seatemp2-text"></span></p>
            <p><strong>Salinity</strong>: <span id="salinity-text"></span></p>
        </div>
    </div>
    <p class="mt1"><strong><em>*NOTE: The instrumentation that collects this data is not in operation at all times, so this gauge may show '0' meters/<span class="review">OFF</span>. It may be inactive during shallow water transits to and from port; during ROV dives, if certain species of whales are within a certain distance of the ship, and while over Undersea Cultural Heritage sites.</em></strong></p>
    <p class="caption"><em>NOAA Ocean Exploration's web team gratefully acknowledges NOAA's <a href="https://www.ncei.noaa.gov/" target="_blank">National Centers for Environmental Information</a> (NCEI) for their support and cooperation in the development of this product.</em><br/>&nbsp;</p>
    <p class="caption">For a deeper dive, access:
        <ul class="caption">
            <li><em>Okeanos Explorer</em> Trackline: <a href="https://noaa.maps.arcgis.com/apps/mapviewer/index.html?layers=ddf7263ea7614932a24f2ce16a0557d5" target="_blank">Full-featured layer map</a>, <a href="https://services2.arcgis.com/C8EMgrsFcRFL6LrL/arcgis/rest/services/Okeanos_Trackline/FeatureServer" target="_blank">API data endpoint</a>.</li>
            <li><em>Okeanos Explorer</em> Position: <a href="https://noaa.maps.arcgis.com/apps/mapviewer/index.html?layers=4bcb226ce9c446fc802cc7f5c29bcc5c" target="_blank">Full-featured layer map</a>, <a href="https://services2.arcgis.com/C8EMgrsFcRFL6LrL/arcgis/rest/services/Okeanos_Explorer_Position/FeatureServer" target="_blank">API data endpoint</a>.</li>
        </ul>
    </p>     
    <hr/>
    <h4>References</h4>
    <ol>
        <li id="ref1"><a href="https://www.weather.gov/lmk/humidity" target="_blank">National Weather Service: Discussion on Humidity&nbsp;<span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a></li>
        <li id="ref2"><a href="https://www.climate.gov/maps-data/data-snapshots/data-source-sea-surface-temperature" target="_blank">Climate.gov: Sea Surface Temperature (SST)&nbsp;<span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a></li>
        <li id="ref3"><a href="https://www.weather.gov/jetstream/seawater" target="_blank">National Weather Service: Sea Water&nbsp;<span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a></li>
    </ol>
    <hr>
</div>