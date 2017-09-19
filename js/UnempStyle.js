// Javascript that compares neighborhood unemployment rates with locations of Workforce Development Centers in New York City

//Define the variable "map" and set the parameters for the user's view of the map
var map = L.map('map').setView([40.71,-73.93], 11);

// set a tile layer to be CartoDB tiles 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

// add these tiles to the map
map.addLayer(CartoDBTiles);

// create global variables we can use for layer controls
var NeighborhoodsGeoJSON;
var WorkforceDGeoJSON;

//use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function
//Add neighborhood dataset
$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var Neighborhoods = data;
    console.log(Neighborhoods);

    // neighborhood choropleth map
    //Demonstrating percent unemployment within each neighborhood
    //Color the polygons based on IF function 
    var UnempStyle = function (feature){
        var value = feature.properties.UnempRate;
        var fillColor = null;
        if(value >= 0 && value <=0.04){
            fillColor = "#F1F10F";
        }
        if(value >0.04 && value <=0.08){
            fillColor = "#DDDD1F";
        }
        if(value >0.08 && value<=0.12){
            fillColor = "#CCCC2B";
        }
        if(value > 0.12 && value <=0.16){
            fillColor = "#ADAD39";
        }
        if(value > 0.16) { 
            fillColor = "#98983D";
        }
     
       console.log(fillColor);
 
 //set fill style for chloropleth map polygons
        var style = {
            weight: 1,
            opacity: .1,
            color: 'white',
            fillOpacity: 0.8,
            fillColor: fillColor
        };

        //output function
        return style;
    }

   //create popup when user clicks on each neighborhoods
    var UnempClick = function (feature, layer) {
        var percent = feature.properties.UnempRate * 100;
        percent = percent.toFixed(0);
        // bind unemployment rate feature properties to pop up
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br /><strong>Percent Unemployed: </strong>" + percent + "%");
    }

//add layer to map
    NeighborhoodsGeoJSON = L.geoJson(Neighborhoods, {
        style: UnempStyle,
        onEachFeature: UnempClick
    }).addTo(map);


    // create layer controls
    createLayerControls(); 

});

// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function
//Add Workforce Development Center dataset

$.getJSON( "geojson/Workforce_Dev_Fac.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var WorkforceD = data;

    // Styling Workforce Development Center Dots
    var WorkforcePointToLayer = function (feature, latlng){
        //console.log(latlng);
        var WorkforceMarker = L.circle(latlng, 100, {
            stroke: false,
            fillColor: '#7C2ED0',
            fillOpacity: 0.98
        });
        
        //function output
        return WorkforceMarker;  
    }

    //create popup when user clicks on each Workforce Center dot
    var WorkforceClick = function (feature, layer) {
        // bind Name and Address feature properties to pop up
        layer.bindPopup("<strong>Name:</strong> " + feature.properties.facname + "<br /><strong>Address: </strong>" + feature.properties.addressnum + " " + feature.properties.streetname);
    }

    //Add layer to map
    WorkforceDGeoJSON = L.geoJson(WorkforceD, {
        pointToLayer: WorkforcePointToLayer,
        onEachFeature: WorkforceClick
    }).addTo(map);


});


function createLayerControls(){

    // add in layer controls
    //Set CartoDB map as the base map
    var baseMaps = {
        "CartoDB": CartoDBTiles
    };

    //Set the neighborhood polygon layer and the Workforce Center point layer as overlay maps
    var overlayMaps = {
        "Neighborhood Info": NeighborhoodsGeoJSON,
        "Workforce Development Center": WorkforceDGeoJSON
    };
           
    
    // add control to map
    L.control.layers(baseMaps, overlayMaps).addTo(map);


}









