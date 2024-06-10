// Inspired by leaflet-rotatedmarker, all credits for the creators.
// original repo: https://github.com/bbecquet/Leaflet.RotatedMarker

import { DomUtil, MarkerOptions, Marker, LatLngExpression } from 'leaflet';

export interface RotatedMarkerOptions extends MarkerOptions {
  rotationAngle?: number;
  rotationOrigin?: string;
}

export default class RotatedMarker extends Marker {
  private _oldIE?: any = DomUtil?.TRANSFORM === 'msTransform';
  private proto_initIcon = (Marker as any).prototype._initIcon;
  private proto_setPos = (Marker as any).prototype._setPos;

  constructor(position: LatLngExpression, options: MarkerOptions) {
    super(position, options);

    this._initializeRotation();
  }

  getOptions(): RotatedMarkerOptions {
    return this?.options as RotatedMarkerOptions;
  }

  setOptions(newOptions: RotatedMarkerOptions): void {
    Object.assign(this.options, newOptions);

    (this as any).update();
  }

  private getIconElement() {
    return (this as any)._icon;
  }

  private _initializeRotation() {
    const { icon, rotationAngle, rotationOrigin } = this.getOptions() || {};

    let iconAnchor: any = [];

    if (icon?.options) {
      iconAnchor = icon?.options?.iconAnchor;
    }

    if (iconAnchor) {
      const [x, y] = iconAnchor;
      iconAnchor = x + 'px ' + y + 'px';
    }

    this.setOptions({
      rotationAngle: rotationAngle || 0,
      rotationOrigin: rotationOrigin || iconAnchor || 'center bottom',
    });

    this?.on('dragend', () => {
      this._applyRotation();
    });

    return this;
  }

  private _initIcon() {
    this.proto_initIcon.call(this);
  }

  private _setPos(pos: any) {
    this.proto_setPos.call(this, pos);
    this._applyRotation();
  }

  private _applyRotation() {
    const { rotationAngle, rotationOrigin } = this.getOptions() || {};

    const icon = this.getIconElement();

    if (!icon) return;

    if (rotationAngle) {
      const style: any = icon?.style || {};
      const transformOrigin: string = DomUtil.TRANSFORM + 'Origin';

      style[transformOrigin] = rotationOrigin;

      if (this._oldIE) {
        // for IE 9, use the 2D rotation
        style[DomUtil.TRANSFORM] = `rotate(${rotationAngle}deg)`;
      } else {
        // for modern browsers, prefer the 3D accelerated version
        style[DomUtil.TRANSFORM] += ` rotateZ(${rotationAngle}deg)`;
      }
    }

    this?.fireEvent('update');
  }

  public setRotationAngle(angle: number) {
    this.setOptions({
      rotationAngle: angle,
    });
  }

  public setRotationOrigin(origin: string) {
    this.setOptions({
      rotationOrigin: origin,
    });
  }
}
