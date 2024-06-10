import { MarkerClusterGroup, MarkerClusterGroupOptions } from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

export interface ClusterGroupOptions extends MarkerClusterGroupOptions {}

interface AdditionalMethods extends BaseFactoryMethods<ClusterGroupOptions> {}

const validateOptions = (options: any): ClusterGroupOptions => {
  const keys: (keyof ClusterGroupOptions)[] = [
    'animate',
    'animateAddingMarkers',
    'attribution',
    'clusterPane',
    'disableClusteringAtZoom',
    'iconCreateFunction',
    'maxClusterRadius',
    'pane',
    'polygonOptions',
    'removeOutsideVisibleBounds',
    'showCoverageOnHover',
    'singleMarkerMode',
    'spiderLegPolylineOptions',
    'spiderfyDistanceMultiplier',
    'spiderfyOnEveryZoom',
    'spiderfyOnMaxZoom',
    'spiderfyShapePositions',
    'zoomToBoundsOnClick',
  ];

  const validOptions = filterProperties<ClusterGroupOptions>({
    object: options,
    map: keys,
  });

  return validOptions as ClusterGroupOptions;
};

export default class ClusterGroup
  extends MarkerClusterGroup
  implements AdditionalMethods
{
  constructor(options: MarkerClusterGroupOptions) {
    const validOptions = validateOptions(options);

    super(validOptions);

    this.setOptions(options);
  }

  getNode() {
    return (this as any)?.getElement();
  }

  getLeafletId() {
    return (this as any)?._leaflet_id;
  }

  setOptions(newOptions: MarkerClusterGroupOptions) {
    const validOptions = validateOptions(newOptions);

    Object.assign(this.options, validOptions);
  }

  getOptions() {
    return this.options;
  }
}
