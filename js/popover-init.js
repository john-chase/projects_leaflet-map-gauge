$("#speed").fu_popover({
    content:"Ship speed in knots. A nautical 'knot' is equivalent to approximately 1.15 miles per hour.",
    placement:"top",
    themeName:'theme_noaa',
    title:'Speed Over Ground <a class="close"><i class="fas fa-window-close closer"></i></a>',
    dismissable: true,
    width: '164px',
});               
$("#course").fu_popover({
    content:"Ship's heading (compass direction).",
    placement:"top",
    themeName:'theme_noaa',
    title:'Course Over Ground <a class="close"><i class="fas fa-window-close closer"></i></a>',
    dismissable: true,
    width: '164px',
});               
$("#wind-spd").fu_popover({
    content:'Measured in knots. True speed (as opposed to  relative or apparent wind speed, which is wind experienced by an observer in motion). <a href="https://en.wikipedia.org/wiki/Beaufort_scale#Modern_scale" target="_blank">Color coded&nbsp;<span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a> to the <a href="https://www.spc.noaa.gov/faq/tornado/beaufort.html" target="_blank">Beaufort Scale&nbsp;<span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a>.',
    placement:"top",
    themeName:'theme_noaa',
    title:'Wind Speed <a class="close"><i class="fas fa-window-close closer"></i></a>',
    dismissable: true,
    width: '164px',
});               
$("#wind-dir").fu_popover({
    content:'True direction (as opposed to relative wind, which is the direction of the airflow produced by an object moving through the airflow).',
    placement:"top",
    themeName:'theme_noaa',
    title:'Wind Direction <a class="close"><i class="fas fa-window-close closer"></i></a>',
    dismissable: true,
    width: '164px',
});               
$("#rel-hum").fu_popover({
    content:'Amount of water vapor in the air, expressed as a percentage. Indicates a present state of absolute humidity relative to a maximum humidity given the same temperature<sup><a href="#ref1">1</a></sup>.',
    placement:"top",
    themeName:'theme_noaa',
    title:'Relative Humidity <a class="close"><i class="fas fa-window-close closer"></i></a>',
    dismissable: true,
    width: '164px',
});               
$("#bar-pressure").fu_popover({
    content:'The force exerted by the atmosphere at a given point; also known as the "weight of the air." Ranging from 963 to 1057 millibars (mbar units).',
    placement:"top",
    themeName:'theme_noaa',
    title:'Barometric Pressure <a class="close"><i class="fas fa-window-close closer"></i></a>',
    dismissable: true,
    width: '164px',
});               
$("#depth").fu_popover({
    content:"Depth from the underside of the ship to the seafloor below, shown in meters (1 meter is 3.3 feet). Ranging from 0 to 11,000 meters (0 to 36,090 feet or 6.8 miles).*",
    placement:"top",
    themeName:'theme_noaa',
    title:'Depth to Ocean Floor <a class="close"><i class="fas fa-window-close closer"></i></a>',
    dismissable: true,
    width: '164px',
}); 
$("#temp1").fu_popover({
    content:"Temperature of the air as measured on the ship, measured in degrees Fahrenheit (°F) in a radial gauge.",
    placement:"top",
    themeName:'theme_noaa',
    title:'Air Temperature (°F) <a class="close"><i class="fas fa-window-close closer"></i></a>',
    dismissable: true,
    width: '164px',
}); 
$("#temp2").fu_popover({
    content:"Temperature of the air as measured on the ship, measured in degrees Celsius (°C) in a linear gauge.",
    placement:"top",
    themeName:'theme_noaa',
    title:'Air Temperature (°C) <a class="close"><i class="fas fa-window-close closer"></i></a>',
    dismissable: true,
    width: '164px',
}); 
$("#seatemp1").fu_popover({
    content:'Water temperature close to the ocean\'s surface, generally between 1 millimeter (0.04 inches) and 20 meters (70 feet) below the sea surface<sup><a href="#ref2">2</a></sup>, shown in degrees Fahrenheit (°F).',
    placement:"top",
    themeName:'theme_noaa',
    title:'Sea Surface Temp (°F) <a class="close"><i class="fas fa-window-close closer"></i></a>',
    dismissable: true,
    width: '164px',
}); 
$("#seatemp2").fu_popover({
    content:'Water temperature close to the ocean\'s surface, generally between 1 millimeter (0.04 inches) and 20 meters (70 feet) below the sea surface<sup><a href="#ref2">2</a></sup>, shown in degrees Celsius (°C).',
    placement:"top",
    themeName:'theme_noaa',
    title:'Sea Surface Temp (°C) <a class="close"><i class="fas fa-window-close closer"></i></a>',
    dismissable: true,
    width: '164px',
}); 
$("#salinity").fu_popover({
    content:'The concentration of salt in the water expressed as a ratio of salt (in grams) to liters (g/L or ‰) of water<sup><a href="#ref3">3</a></sup>.',
    placement:"top",
    themeName:'theme_noaa',
    title:'Sea Surface Temp 2 <a class="close"><i class="fas fa-window-close closer"></i></a>',
    dismissable: true,
    width: '164px',
}); 
$(document).on("click", ".close" , function(){
    $(this).parents(".fu_popover_theme_noaa").hide();
});