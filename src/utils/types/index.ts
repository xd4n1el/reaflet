export type LayerMethods =
  | 'togglePopup'
  | 'toggleTooltip'
  | 'setContent'
  | 'getContent'
  | 'unbindTooltip'
  | 'unbindPopup'
  | 'setPopupContent'
  | 'setTooltipContent'
  | 'isTooltipOpen'
  | 'isPopupOpen'
  | 'getTooltip'
  | 'getPopup'
  | 'closePopup'
  | 'closeTooltip'
  | 'openTooltip'
  | 'openPopup'
  | 'bindTooltip'
  | 'bindPopup';

export type InvalidMethods = 'setPopupContent' | 'setTooltipContent';
