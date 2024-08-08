import { useCallback, useEffect, useState } from 'react';
import { useMap } from '@/hooks/useMap';

import { LatLng, LatLngExpression, LeafletEvent, Routing } from 'leaflet';

import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

type Waypoint =
  | number[]
  | LatLngExpression
  | { lat: number; lng: number }
  | { latitude: number; longitude: number };

type BaseEvent = Omit<LeafletEvent, 'popup'>;

interface Control extends Omit<Routing.Control, 'addTo' | 'pointMarkerStyle'> {}

interface RouteStartEvent extends Routing.RoutingEvent, BaseEvent {}

interface RouteErrorEvent extends Routing.RoutingErrorEvent, BaseEvent {}

interface RouteSpliceEvent extends Routing.WaypointsSplicedEvent, BaseEvent {}

interface RouteSelectEvent extends Routing.RouteSelectedEvent, BaseEvent {
  alternatives: Routing.IRoute[];
}

interface RoutesFoundEvent extends Routing.RoutingResultEvent, BaseEvent {
  waypoints: Routing.Waypoint[];
}

interface RoutingEvents {
  onError?: (event: RouteErrorEvent) => void;
  onStart?: (event: RouteStartEvent) => void;
  onSelectRoute?: (event: RouteSelectEvent) => void;
  onRoutesFound?: (event: RoutesFoundEvent) => void;
  onWaypointsChange?: (event: RouteStartEvent) => void;
  onSpliceWaypoints?: (event: RouteSpliceEvent) => void;
}

export interface RouterOptions
  extends Omit<Routing.RoutingControlOptions, 'waypoints'>,
    RoutingEvents {
  waypoints?: Waypoint[];
}

export const useRoutingMachine = ({
  router,
  waypoints = [],
  onError,
  onStart,
  onRoutesFound,
  onSelectRoute,
  onWaypointsChange,
  onSpliceWaypoints,
  ...rest
}: RouterOptions = {}): Control => {
  const [control, setControl] = useState<Control>();

  const map = useMap();

  useEffect(() => {
    if (!map) return;

    return init();
  }, [map]);

  const resolveWaypoints = (
    positions: Waypoint[] = [],
  ): Routing.Waypoint[] | LatLng[] => {
    return positions.map(waypoint => {
      if (Array.isArray(waypoint)) {
        const [a, b] = waypoint || [];

        return new LatLng(a, b);
      } else if (waypoint instanceof LatLng) {
        return waypoint;
      }

      const { lat, lng, latitude, longitude } = (waypoint as any) || {};

      if (latitude && longitude) {
        return new LatLng(latitude, longitude);
      }

      return new LatLng(lat, lng);
    });
  };

  const init = useCallback(() => {
    const osrm = new Routing.OSRMv1({
      suppressDemoServerWarning: true,
    });

    const routingControl = new Routing.Control({
      ...rest,
      waypoints: resolveWaypoints(waypoints),
      router: router || osrm,
      pointMarkerStyle: {
        radius: 5,
        fillColor: 'blue',
      },
      createMarker() {
        return null;
      },
      lineOptions: {
        extendToWaypoints: true,
        missingRouteTolerance: 5,
        styles: [{ fillColor: 'blue' }],
        missingRouteStyles: [{ fillColor: 'red' }],
      },
    } as any);

    // dirty code but heavy performance
    if (onStart) routingControl.on('routingstart', onStart);
    if (onError) routingControl.on('routingerror', onError);
    if (onRoutesFound) routingControl.on('routesfound', onRoutesFound);
    if (onSelectRoute) routingControl.on('routeselected', onSelectRoute);
    if (onWaypointsChange) {
      routingControl.on('waypointschanged', onWaypointsChange);
    }
    if (onSpliceWaypoints) {
      routingControl.on('waypointsspliced', onSpliceWaypoints);
    }

    routingControl?.addTo(map);

    setControl(routingControl);

    return () => {
      routingControl?.remove();
    };
  }, [map]);

  return control!;
};
