# Reaflet

<p align="center">
 <a href="https://reaflet.vercel.app" target="blank"><img src="public/reaflet-logo.png" width="200" alt="Reaflet Logo" /></a>
</p>

## Description
Leaflet abstraction for React, focused on React semantics, performance and easy customization.

## Overview
Reaflet is a library that integrates React with Leaflet, making it easy to create interactive maps in your React applications. With Reaflet, you can create and customize maps effortlessly using React components that abstract the complexity of the Leaflet API.

## Features
- **React Components**: Includes ready-to-use components that encapsulate Leaflet functionality.
- **Easy Customization**: Allows for the customization of maps and layers.
- **Event Support**: Maps Leaflet events to React properties.
- **Compatibility**: Works with the latest versions of React and Leaflet.
- **Extensible**: Easily extendable with additional plugins and custom components to enhance functionality.
- **Performance**: Designed to ensure high performance, including fast rendering and handling of large datasets.

## Getting Started

### Installation

```bash
 $ npm install reafletjs 
```

Or

```bash
 $ yarn add reafletjs 
```

### Documentation
[Full Documentation](https://reaflet.vercel.app/home) Here you can find examples and more descriptions of the features Reaflet provides.

### Usage

**Adding the Map and TileLayer to create your map component.**

```jsx
import { Map, TileLayer } from "reafletjs"

import 'reafletjs/reaflet.css';

const App = () => {
    return (
        <Map
            center={[0, 0]}
            zoom={4}
            maxZoom={20}
            keyboard
            doubleClickZoom={false}>
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    maxZoom={22}
                    minZoom={4}
                />
        </Map>
    )
};

export default App;
```

*For the map to work, the TileLayer should be nested within the Map component. TileLayer handles the drawing of map image tiles, and Map serves as the global container for all components. CSS styles are optional you can make your own.*

**Adding a Marker in the Map**

```jsx
import { Map, TileLayer, Marker, Icon, Popup, Tooltip } from "reafletjs"

import 'reafletjs/reaflet.css';

const App = () => {
    return (
        <Map
            center={[0, 0]}
            zoom={4}
            maxZoom={20}
            keyboard
            doubleClickZoom={false}>
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    maxZoom={22}
                    minZoom={4}
                />

                <Marker position={[0, 0]}>
                    <Icon src="https://www.your-image-url.com" size={[45, 45]} iconAnchor={[22.2, 50]} />

                    <Popup />
                    <Tooltip />
                </Marker>
        </Map>
    )
};

export default App;
```

*The Marker component is easily customizable with the Icon or DivIcon components. Additionally, the Marker can have smooth movement by adding the 'smoothDuration' prop.*

**Icon vs DivIcon**

*Icon creates an image, whereas DivIcon creates an HTML element and also accepts children.*

### Create your own plugins 

*Reaflet uses an system of component and factory, the factory provide all the methods to your component.*

*factory should be a class and contain base factory methods.*

**Factory Class**

```jsx
import { Marker } from "leaflet"
import { BaseFactoryMethods } from "reafletjs/factory" // just a helper

export default class MyElementFactory extends Marker implements BaseFactoryMethods {
    constructor(position, options) {
        super(position, options)
    }
}
```

**Custom Component**

```jsx
import { useElementFactory, useElementUpdate, useElementLifeCycle, useElementEvents, Element } from "reafletjs/factory"
import MyElementFactory from "./MyElementFactory";

 const MyElement = ({ children, position, ...rest }) => {
    const { element } = useElementFactory({
        Factory: MyElementFactory,
        options: [position, rest] // args of constructor
    });
    useElementUpdate({ element, props: { ...rest, position }, handlers: {
        position(prevValue, nextValue, instance) {
            // checking the values and apply the update
            instance?.setLatLng(nextValue);
        }
        // ...other handlers
    } })
    useElementEvents({ element, props: rest });
    useElementLifeCycle({ element });

    return <Element container={element}>{children}</Element>
 };

export default MyElement
```

*Read [Factory Full Documentation](https://reaflet.vercel.app/factory) for more examples.*

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue on [GitHub Repository](https://github.com/xd4n1el/reaflet).

## License

This project is licensed under the [MIT License](LICENSE).

## Changes
See [CHANGELOG](CHANGELOG.md)