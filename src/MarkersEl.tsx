import { LatLng } from 'leaflet';
import Marker, { MarkerProps } from '@components/Marker';
import Icon, { IconProps } from '@components/Icon';
import { FC, useEffect, useState } from 'react';

// import IMG from '@/images/marker.png';
import ElementCollection, {
  ElementCollectionData,
} from '@components/ElementCollection';

type MarkerChild = ElementCollectionData<MarkerProps, [IconProps]>;

interface MarkersProps {
  size?: number;
}

export const getRandomLatLng = () => {
  // Latitude ranges from -90 to 90
  const lat = Math.random() * 180 - 90;

  // Longitude ranges from -180 to 180
  const lng = Math.random() * 360 - 180;

  return new LatLng(lat, lng);
};

const createMarkersArray = (size: number): MarkerChild[] => {
  const markers: MarkerChild[] = [];

  for (let i = 0; i < size; i++) {
    const key = `marcador-${i + 1}`;
    const position = getRandomLatLng();
    const draggable = true;
    const childrenProps: [IconProps] = [
      {
        // src: IMG,
        size: [45, 45],
        anchor: [22.5, 45],
        popupAnchor: [0, -55],
        imageLoading: 'lazy',
      },
    ];

    markers.push({ key, position, draggable, childrenProps });
  }

  return markers;
};

const Markers: FC<MarkersProps> = ({ size }: any) => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // setMarkers(generateRandomLatLngArray(size));

    const x: MarkerChild[] = createMarkersArray(size);

    setItems(x);
  }, [size]);

  return (
    <ElementCollection data={items} chunkAt={150} maxChunkSize={500}>
      <Marker>
        <Icon />
      </Marker>
    </ElementCollection>
  );
};

export default Markers;
