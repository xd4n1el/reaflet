// Inspired by leaflet-rotatedmarker, all credits for the creators.
// original repo: https://github.com/bbecquet/Leaflet.RotatedMarker

import DriftMarker from './DriftMarker';
import { DomUtil, MarkerOptions, Marker, LatLngExpression } from 'leaflet';

interface RotationOptions {
  animate?: boolean;
}

export interface RotatedMarkerOptions extends MarkerOptions {
  rotationAngle?: number;
  rotationOrigin?: string;
}

export default class RotatedMarker extends DriftMarker {
  private _oldIE?: any = DomUtil?.TRANSFORM === 'msTransform';
  private proto_initIcon = (Marker as any).prototype._initIcon;
  private proto_setPos: (el?: any, x?: any, pos?: any) => void = (Marker as any)
    .prototype._setPos;
  private _isRotating: boolean = false;
  private _angle?: number;
  private _duration?: number;

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

  public isRotating(): boolean {
    return this._isRotating;
  }

  private getIconElement() {
    return this.getElement();
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

    this.on('movestart', () => {
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

  private _applyRotation(options?: RotationOptions) {
    const { rotationAngle, rotationOrigin } = this.getOptions() || {};
    const currentAngle = this._angle;

    const icon = this.getIconElement();

    if (!icon) return;

    this._isRotating = true;

    const style: any = icon.style || {};
    const transformOrigin: string = DomUtil.TRANSFORM + 'Origin';

    // Set the transform origin if it's not already set correctly
    if (style[transformOrigin] !== rotationOrigin) {
      style[transformOrigin] = rotationOrigin;
    }

    // apply smooth transition to icon rotation
    if (!style[DomUtil.TRANSITION] && options?.animate) {
      style[DomUtil.TRANSITION] = `transform 300ms ease`;
    }

    // Extract and keep existing transformations
    let transform = style[DomUtil.TRANSFORM] || '';

    if (typeof currentAngle === 'number') {
      if (this._oldIE) {
        // For IE 9, use the 2D rotation
        transform = transform.replace(/rotate\(.*?\)/g, '');
        style[DomUtil.TRANSFORM] = `${transform} rotate(${currentAngle}deg)`;
      } else {
        // For modern browsers, use the 3D accelerated version
        transform = transform.replace(/rotateZ\(.*?\)/g, '');
        style[DomUtil.TRANSFORM] = `${transform} rotateZ(${currentAngle}deg)`;
      }
    }

    // Update options with the new rotation angle if it's different
    if (currentAngle !== rotationAngle) {
      this.setOptions({ rotationAngle: currentAngle });
    }

    this?.fireEvent('update');
  }

  public setRotationAngle(angle: number, options?: RotationOptions) {
    this._angle = angle;
    this.setOptions({ rotationAngle: angle });
    this._applyRotation(options);
  }

  public setRotationOrigin(origin: string) {
    Object.assign({ rotationOrigin: origin });
  }
}
