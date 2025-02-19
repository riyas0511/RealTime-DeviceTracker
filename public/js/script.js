const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit("sendLocation", {latitude, longitude});
    },error => {
        console.log(error);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,    //checks for location every 5 seconds
        maximumAge: 0   //ensures no caching
    });
}

const map = L.map("map").setView([0, 0], 10); //map is the id of the div element in index.ejs and
                                  //  setView is the method to set the view of the map and the first parameter is the latitude and longitude and
                                  //  the second parameter is the zoom level of the map.
                                 //L.map is a function from leaflet library which is used to create a map object and it takes the id of the div element as a parameter. 

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: 'OPEN STREET MAP'
}).addTo(map); //tileLayer is a function from leaflet library which is used to add a tile layer to the map and it takes the url of the tile layer as a parameter.

const marker={};

socket.on("locationMessage", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude], 10);
    if(marker[id]){
        marker[id].setLatLng([latitude, longitude]);
    }else{
        marker[id] = L.marker([latitude, longitude]).addTo(map);  //we can customise the marker by passing an object as a second parameter to the L.marker function.
    }
});

socket.on("user-disconnected", (data) => {
    if(marker[data.id]){
        map.removeLayer(marker[data.id]);
        delete marker[data.id];
    }
});