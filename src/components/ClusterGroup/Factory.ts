import { MarkerClusterGroup, MarkerClusterGroupOptions, Util } from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

export interface ClusterGroupOptions extends MarkerClusterGroupOptions {}

interface AdditionalMethods
  extends Omit<BaseFactoryMethods<ClusterGroupOptions>, 'setInteractive'> {}

export const clusterGroupKeys: (keyof ClusterGroupOptions)[] = [
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

const validateOptions = (options: any): ClusterGroupOptions => {
  const validOptions = filterProperties<ClusterGroupOptions>({
    object: options,
    map: clusterGroupKeys,
  });

  return validOptions as ClusterGroupOptions;
};

export default class ClusterGroupFactory
  extends MarkerClusterGroup
  implements AdditionalMethods
{
  constructor(options: MarkerClusterGroupOptions) {
    const validOptions = validateOptions(options);

    super(validOptions);
  }

  getNode() {
    return (this as any)?.getElement();
  }

  getLeafletId() {
    return Util.stamp(this);
  }

  getOptions() {
    return this.options;
  }

  setOptions(newOptions: MarkerClusterGroupOptions) {
    const validOptions = validateOptions(newOptions);

    Util.setOptions(this.options, validOptions);
  }
}
