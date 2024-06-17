# Reaflet

### Overview
Reaflet is a library that integrates React with Leaflet, making it easy to create interactive maps in your React applications. With Reaflet, you can create and customize maps effortlessly using React components that abstract the complexity of the Leaflet API.

Features
React Components: Includes ready-to-use components that encapsulate Leaflet functionality.
Easy Customization: Allows for the customization of maps and layers.
Event Support: Maps Leaflet events to React properties.
Compatibility: Works with the latest versions of React and Leaflet.
Installation
To install the library, use npm or yarn:

sh
npm install reaflet
or

sh
yarn add reaflet
Basic Usage
Here is a basic example of how to use Reaflet to create a map:

jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'reaflet';

const App = () => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default App;

### Documentation
Main Components
MapContainer: The main component that creates the map container.
TileLayer: Adds tile layers to the map.
Marker: Adds a marker to the map.
Popup: Adds a popup that can be attached to a marker or other elements.
Common Properties
center (MapContainer): Sets the initial center position of the map. Example: [latitude, longitude].
zoom (MapContainer): Sets the initial zoom level of the map.
url (TileLayer): The URL of the tile to be loaded. Can include parameters like {z}, {x}, and {y}.
position (Marker): Sets the position of the marker on the map.
Events
You can use properties to map Leaflet events to React callbacks. For example:

jsx

<MapContainer 
  center={[51.505, -0.09]} 
  zoom={13} 
  style={{ height: "100vh", width: "100%" }}
  />


Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue on this repository.

License
This project is licensed under the MIT License.

### A better documentation is in progress.